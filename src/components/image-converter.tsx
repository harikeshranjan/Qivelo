import { useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import {
    ArrowDownToLine,
    ArrowLeft,
    CircleAlert,
    ImageUp,
    LoaderCircle,
    Lock,
    RefreshCw,
    Trash2,
} from "lucide-react";
import { Button } from "./ui/button";

export type ConversionResult = {
    blob: Blob;
    width: number;
    height: number;
};

type ImageConverterProps = {
    title: string;
    description: string;
    inputFormat: string;
    outputFormat: string;
    acceptedTypes: string[];
    acceptedExtensions: string[];
    outputExtension: string;
    convert: (file: File) => Promise<ConversionResult>;
};

type ImageFile = {
    file: File;
    previewUrl: string;
    outputUrl: string | null;
    width: number | null;
    height: number | null;
    outputSize: number | null;
};

type View = "original" | "converted";

const primaryButton =
    "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400";

const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const revokeImage = (image: ImageFile | null) => {
    if (!image) return;

    URL.revokeObjectURL(image.previewUrl);

    if (image.outputUrl) {
        URL.revokeObjectURL(image.outputUrl);
    }
};

export default function ImageConverter({
    title,
    description,
    inputFormat,
    outputFormat,
    acceptedTypes,
    acceptedExtensions,
    outputExtension,
    convert,
}: ImageConverterProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<ImageFile | null>(null);
    const jobRef = useRef(0);
    const dragDepth = useRef(0);

    const [image, setImage] = useState<ImageFile | null>(null);
    const [view, setView] = useState<View>("converted");
    const [isDragging, setIsDragging] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState("");

    imageRef.current = image;

    useEffect(() => {
        return () => revokeImage(imageRef.current);
    }, []);

    const runConversion = async (
        file: File,
        previewUrl: string,
        jobId: number,
    ) => {
        setIsConverting(true);

        try {
            const result = await convert(file);

            // Ignore results from an older conversion.
            if (jobId !== jobRef.current) return;

            if (
                !result.blob.type ||
                result.blob.size === 0 ||
                !Number.isFinite(result.width) ||
                !Number.isFinite(result.height) ||
                result.width <= 0 ||
                result.height <= 0
            ) {
                throw new Error("The converter returned an invalid image.");
            }

            const outputUrl = URL.createObjectURL(result.blob);

            setImage((current) => {
                if (!current || current.previewUrl !== previewUrl) {
                    URL.revokeObjectURL(outputUrl);
                    return current;
                }

                // Release the previous output if this image was reconverted.
                if (current.outputUrl) {
                    URL.revokeObjectURL(current.outputUrl);
                }

                return {
                    ...current,
                    outputUrl,
                    width: result.width,
                    height: result.height,
                    outputSize: result.blob.size,
                };
            });

            setView("converted");
        } catch (err) {
            if (jobId !== jobRef.current) return;

            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong during conversion.",
            );
        } finally {
            if (jobId === jobRef.current) {
                setIsConverting(false);
            }
        }
    };

    const loadImage = (file?: File) => {
        if (!file) return;

        setError("");

        const lowerName = file.name.toLowerCase();
        const hasAcceptedExtension = acceptedExtensions.some((extension) =>
            lowerName.endsWith(extension.toLowerCase()),
        );

        const hasAcceptedType = acceptedTypes.includes(file.type);

        if (!hasAcceptedExtension && !hasAcceptedType) {
            setError(`Please select a supported ${inputFormat} image.`);
            return;
        }

        if (file.size === 0) {
            setError("This file is empty. Please select another image.");
            return;
        }

        // Invalidate any conversion that is still running.
        const jobId = ++jobRef.current;

        revokeImage(imageRef.current);

        const previewUrl = URL.createObjectURL(file);

        setImage({
            file,
            previewUrl,
            outputUrl: null,
            width: null,
            height: null,
            outputSize: null,
        });

        setView("original");
        setIsConverting(true);

        void runConversion(file, previewUrl, jobId);
    };

    const removeImage = () => {
        jobRef.current++;

        revokeImage(imageRef.current);

        setImage(null);
        setError("");
        setIsConverting(false);
        setView("converted");

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const downloadImage = () => {
        if (!image?.outputUrl) return;

        const anchor = document.createElement("a");
        const baseName = image.file.name.replace(/\.[^.]+$/, "");

        anchor.href = image.outputUrl;
        anchor.download = `${baseName}.${outputExtension}`;

        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    };

    const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        dragDepth.current++;
        setIsDragging(true);
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        dragDepth.current = Math.max(0, dragDepth.current - 1);

        if (dragDepth.current === 0) {
            setIsDragging(false);
        }
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        dragDepth.current = 0;
        setIsDragging(false);

        loadImage(event.dataTransfer.files[0]);
    };

    const isReady = Boolean(image?.outputUrl);

    const shownSrc =
        image && view === "converted" && image.outputUrl
            ? image.outputUrl
            : image?.previewUrl;

    const sizeDelta =
        image?.outputSize != null && image.file.size > 0
            ? ((image.outputSize - image.file.size) / image.file.size) * 100
            : null;

    const details = image
        ? [
              {
                  label: "Dimensions",
                  value:
                      image.width !== null && image.height !== null
                          ? `${image.width} × ${image.height} px`
                          : "—",
              },
              {
                  label: `${inputFormat} size`,
                  value: formatBytes(image.file.size),
              },
              {
                  label: `${outputFormat} size`,
                  value:
                      image.outputSize !== null
                          ? formatBytes(image.outputSize)
                          : "—",
              },
              {
                  label: "Difference",
                  value:
                      sizeDelta !== null
                          ? `${sizeDelta > 0 ? "+" : ""}${sizeDelta.toFixed(0)}%`
                          : "—",
              },
          ]
        : [];

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <header className="mb-8">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="-ml-1 mb-5 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                    <ArrowLeft className="size-4" />
                    Back
                </button>

                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {title}
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    {description}
                </p>
            </header>

            <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {!image ? (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className={`group flex min-h-72 w-full flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-96 ${
                            isDragging
                                ? "border-emerald-500 bg-emerald-500/5"
                                : "border-border bg-card hover:border-foreground/30"
                        }`}
                    >
                        <span
                            className={`mb-4 flex size-12 items-center justify-center rounded-full transition-colors ${
                                isDragging
                                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                    : "bg-muted text-muted-foreground group-hover:text-foreground"
                            }`}
                        >
                            <ImageUp className="size-5" />
                        </span>

                        <span className="text-base font-medium">
                            {isDragging
                                ? "Drop to convert"
                                : `Drop a ${inputFormat} here, or click to browse`}
                        </span>

                        <span className="mt-1.5 text-sm text-muted-foreground">
                            {acceptedExtensions.join(", ").toUpperCase()} files
                        </span>

                        <span
                            className={`mt-6 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium transition-colors ${primaryButton}`}
                        >
                            Select image
                        </span>
                    </button>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
                        <section
                            className={`min-w-0 overflow-hidden rounded-xl border bg-card transition-colors ${
                                isDragging
                                    ? "border-emerald-500"
                                    : "border-border"
                            }`}
                        >
                            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                                <div
                                    role="tablist"
                                    aria-label="Image preview"
                                    className="inline-flex rounded-lg bg-muted p-0.5 text-sm"
                                >
                                    {(
                                        [
                                            ["original", inputFormat],
                                            ["converted", outputFormat],
                                        ] as const
                                    ).map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            role="tab"
                                            aria-selected={view === value}
                                            disabled={
                                                value === "converted" &&
                                                !isReady
                                            }
                                            onClick={() => setView(value)}
                                            className={`rounded-md px-3 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                                                view === value
                                                    ? "bg-background text-foreground shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {isConverting ? (
                                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <LoaderCircle className="size-3.5 animate-spin" />
                                        Converting…
                                    </span>
                                ) : (
                                    isDragging && (
                                        <span className="text-xs text-emerald-600 dark:text-emerald-400">
                                            Drop to replace
                                        </span>
                                    )
                                )}
                            </div>

                            <div className="flex min-h-64 items-center justify-center bg-muted/40 p-4 sm:min-h-96 sm:p-6">
                                {shownSrc && (
                                    <img
                                        src={shownSrc}
                                        alt={`${view === "converted" ? outputFormat : inputFormat} preview`}
                                        className="max-h-112 max-w-full rounded object-contain"
                                    />
                                )}
                            </div>
                        </section>

                        <aside className="min-w-0 space-y-4 lg:self-start">
                            <div className="rounded-xl border border-border bg-card">
                                <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
                                    <p
                                        className="min-w-0 truncate text-sm font-medium"
                                        title={image.file.name}
                                    >
                                        {image.file.name}
                                    </p>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={removeImage}
                                        aria-label="Remove image"
                                        className="-mr-2 size-8 shrink-0 text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>

                                <dl className="divide-y divide-border px-4 text-sm">
                                    {details.map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center justify-between gap-4 py-2.5"
                                        >
                                            <dt className="text-muted-foreground">
                                                {item.label}
                                            </dt>
                                            <dd className="font-medium tabular-nums">
                                                {item.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>

                                <div className="space-y-2 border-t border-border p-4">
                                    <Button
                                        type="button"
                                        disabled={!isReady}
                                        onClick={downloadImage}
                                        className={`h-10 w-full ${primaryButton}`}
                                    >
                                        {isReady ? (
                                            <ArrowDownToLine className="mr-2 size-4" />
                                        ) : (
                                            <LoaderCircle className="mr-2 size-4 animate-spin" />
                                        )}
                                        {isReady
                                            ? `Download ${outputFormat}`
                                            : "Converting…"}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            inputRef.current?.click()
                                        }
                                        className="h-10 w-full"
                                    >
                                        <RefreshCw className="mr-2 size-4" />
                                        Choose another image
                                    </Button>
                                </div>
                            </div>

                            <p className="px-1 text-xs leading-5 text-muted-foreground">
                                Converting formats does not restore detail
                                already lost through compression. The output
                                file size may be larger or smaller than the
                                original.
                            </p>
                        </aside>
                    </div>
                )}

                {error && (
                    <div
                        role="alert"
                        className="mt-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                    >
                        <CircleAlert className="mt-0.5 size-4 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept={[...acceptedExtensions, ...acceptedTypes].join(",")}
                    className="hidden"
                    onChange={(event) => {
                        loadImage(event.target.files?.[0]);
                        event.target.value = "";
                    }}
                />
            </div>

            <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="size-3.5 shrink-0" />
                Images are converted locally and never uploaded by this
                component.
            </p>
        </div>
    );
}
