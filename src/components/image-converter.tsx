import { useEffect, useRef, useState } from "react";
import type { DragEvent } from "react";
import {
    ArrowDownToLine,
    ArrowLeft,
    CircleAlert,
    FileImage,
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
    "bg-linear-to-b from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-600/25 ring-1 ring-inset ring-white/15 hover:from-emerald-500 hover:to-emerald-700 dark:from-emerald-400 dark:to-emerald-500 dark:text-emerald-950 dark:shadow-emerald-500/20 dark:hover:from-emerald-300 dark:hover:to-emerald-500";

const surface =
    "rounded-3xl border border-border/70 bg-card/80 shadow-xl shadow-black/[0.04] backdrop-blur-sm dark:shadow-black/30";

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

    const maxSize = image
        ? Math.max(image.file.size, image.outputSize ?? 0)
        : 1;

    return (
        <div className="relative isolate w-full overflow-hidden">
            {/* Ambient background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
            >
                <div className="absolute left-1/2 top-0 h-96 w-3xl max-w-full -translate-x-1/2 -translate-y-1/3 rounded-full bg-emerald-500/[0.08] blur-[110px] dark:bg-emerald-400/[0.07]" />
                <div className="absolute -right-24 top-1/2 size-80 rounded-full bg-emerald-500/[0.04] blur-[100px]" />
            </div>

            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                <header className="mb-10 sm:mb-12">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="-ml-1 mb-6 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                        <ArrowLeft className="size-4" />
                        Back
                    </button>

                    <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                        {title}
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
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
                            className={`group relative flex min-h-96 w-full flex-col items-center justify-center overflow-hidden border-dashed px-6 py-16 text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none sm:min-h-112 ${surface} ${
                                isDragging
                                    ? "border-emerald-500 bg-emerald-500/[0.04] ring-4 ring-emerald-500/10"
                                    : "hover:border-emerald-500/40"
                            }`}
                        >
                            {/* Icon with orbit rings and format chips */}
                            <div className="relative mb-12 mt-6 flex size-20 items-center justify-center">
                                <div
                                    aria-hidden="true"
                                    className={`absolute -inset-7 rounded-full border transition-all duration-500 motion-reduce:transition-none ${
                                        isDragging
                                            ? "scale-110 border-emerald-500/50"
                                            : "border-border/70 group-hover:scale-105 group-hover:border-emerald-500/30"
                                    }`}
                                />
                                <div
                                    aria-hidden="true"
                                    className="absolute -inset-16 rounded-full border border-dashed border-border/50"
                                />

                                <div
                                    aria-hidden="true"
                                    className="absolute -left-40 top-1 hidden -rotate-6 items-center gap-2 rounded-xl border border-border/80 bg-card/90 px-3 py-2 shadow-lg backdrop-blur-md lg:flex"
                                >
                                    <span className="flex size-7 items-center justify-center rounded-lg bg-muted font-mono text-[10px] font-bold uppercase text-muted-foreground">
                                        {inputFormat.slice(0, 3)}
                                    </span>
                                    <span className="text-xs font-medium">
                                        Your image
                                    </span>
                                </div>

                                <div
                                    aria-hidden="true"
                                    className="absolute -right-40 bottom-1 hidden rotate-6 items-center gap-2 rounded-xl border border-border/80 bg-card/90 px-3 py-2 shadow-lg backdrop-blur-md lg:flex"
                                >
                                    <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 font-mono text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                                        {outputFormat.slice(0, 3)}
                                    </span>
                                    <span className="text-xs font-medium">
                                        Ready in a blink
                                    </span>
                                </div>

                                <div
                                    className={`relative flex size-20 items-center justify-center rounded-3xl border bg-card shadow-xl transition-all duration-300 motion-reduce:transition-none ${
                                        isDragging
                                            ? "-translate-y-1 border-emerald-500/40 shadow-emerald-500/20"
                                            : "border-emerald-500/20 shadow-emerald-950/5 group-hover:-translate-y-0.5"
                                    }`}
                                >
                                    <ImageUp className="size-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>

                            <span className="relative text-lg font-semibold tracking-tight sm:text-xl">
                                {isDragging
                                    ? "Release to convert"
                                    : `Drop a ${inputFormat} here, or click to browse`}
                            </span>

                            <span className="relative mt-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                                {acceptedExtensions.join("  ·  ")}
                            </span>

                            <span
                                className={`relative mt-8 inline-flex h-11 items-center rounded-xl px-6 text-sm font-medium transition-all group-hover:-translate-y-px ${primaryButton} cursor-pointer`}
                            >
                                Select image
                            </span>
                        </button>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-8">
                            {/* Preview */}
                            <section
                                className={`min-w-0 overflow-hidden transition-all duration-300 motion-reduce:transition-none ${surface} ${
                                    isDragging
                                        ? "border-emerald-500 ring-4 ring-emerald-500/10"
                                        : ""
                                }`}
                            >
                                <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3 sm:px-5">
                                    <div
                                        role="tablist"
                                        aria-label="Image preview"
                                        className="relative grid grid-cols-2 rounded-xl bg-muted p-1 text-sm"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-background shadow-sm ring-1 ring-black/5 transition-transform duration-300 ease-out motion-reduce:transition-none dark:ring-white/10 ${
                                                view === "converted"
                                                    ? "translate-x-full"
                                                    : ""
                                            }`}
                                        />

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
                                                className={`relative z-10 rounded-lg px-5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                                                    view === value
                                                        ? "text-foreground"
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
                                    ) : isDragging ? (
                                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                            Drop to replace
                                        </span>
                                    ) : isReady ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <span className="size-1.5 rounded-full bg-emerald-500" />
                                            Ready
                                        </span>
                                    ) : null}
                                </div>

                                <div className="flex min-h-72 items-center justify-center bg-muted/30 p-5 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:20px_20px] sm:min-h-112 sm:p-8">
                                    {shownSrc && (
                                        <img
                                            src={shownSrc}
                                            alt={`${view === "converted" ? outputFormat : inputFormat} preview`}
                                            className={`max-h-112 max-w-full rounded-xl object-contain shadow-2xl shadow-black/15 ring-1 ring-black/5 transition-opacity duration-300 dark:ring-white/10 ${
                                                isConverting ? "opacity-60" : ""
                                            }`}
                                        />
                                    )}
                                </div>
                            </section>

                            {/* Result */}
                            <aside className="min-w-0 space-y-4 lg:self-start">
                                <div className={surface}>
                                    {/* File */}
                                    <div className="flex items-center gap-3 border-b border-border/70 p-4">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background">
                                            <FileImage className="size-4.5 text-muted-foreground" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p
                                                className="truncate text-sm font-medium"
                                                title={image.file.name}
                                            >
                                                {image.file.name}
                                            </p>
                                            <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                                                {image.width !== null &&
                                                image.height !== null
                                                    ? `${image.width} × ${image.height}`
                                                    : inputFormat}
                                            </p>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={removeImage}
                                            aria-label="Remove image"
                                            className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>

                                    {/* Size comparison */}
                                    <div className="space-y-4 border-b border-border/70 p-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                                File size
                                            </h2>

                                            {sizeDelta !== null && (
                                                <span
                                                    className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums ${
                                                        sizeDelta > 0
                                                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                                                            : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                                    }`}
                                                >
                                                    {sizeDelta > 0 ? "+" : ""}
                                                    {sizeDelta.toFixed(0)}%
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <div className="mb-1.5 flex items-baseline justify-between text-xs">
                                                    <span className="font-mono uppercase tracking-wider text-muted-foreground">
                                                        {inputFormat}
                                                    </span>
                                                    <span className="font-medium tabular-nums">
                                                        {formatBytes(
                                                            image.file.size,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                                    <div
                                                        className="h-full rounded-full bg-foreground/25 transition-all duration-700 ease-out motion-reduce:transition-none"
                                                        style={{
                                                            width: `${(image.file.size / maxSize) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="mb-1.5 flex items-baseline justify-between text-xs">
                                                    <span className="font-mono uppercase tracking-wider text-muted-foreground">
                                                        {outputFormat}
                                                    </span>
                                                    <span className="font-medium tabular-nums">
                                                        {image.outputSize !==
                                                        null
                                                            ? formatBytes(
                                                                  image.outputSize,
                                                              )
                                                            : "—"}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                                    {image.outputSize !==
                                                    null ? (
                                                        <div
                                                            className="h-full rounded-full bg-linear-to-r from-emerald-500 to-emerald-400 transition-all duration-700 ease-out motion-reduce:transition-none"
                                                            style={{
                                                                width: `${(image.outputSize / maxSize) * 100}%`,
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="h-full w-1/3 animate-pulse rounded-full bg-emerald-500/30" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-2.5 p-4">
                                        <Button
                                            type="button"
                                            disabled={!isReady}
                                            onClick={downloadImage}
                                            className={`h-11 w-full rounded-xl text-sm font-medium ${primaryButton}`}
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
                                            className="h-11 w-full rounded-xl"
                                        >
                                            <RefreshCw className="mr-2 size-4" />
                                            Choose another image
                                        </Button>
                                    </div>
                                </div>

                                <p className="px-2 text-xs leading-5 text-muted-foreground">
                                    Converting formats does not restore detail
                                    already lost through compression. The output
                                    file may be larger or smaller than the
                                    original.
                                </p>
                            </aside>
                        </div>
                    )}

                    {error && (
                        <div
                            role="alert"
                            className="mt-4 flex items-start gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                        >
                            <CircleAlert className="mt-0.5 size-4 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <input
                        ref={inputRef}
                        type="file"
                        accept={[...acceptedExtensions, ...acceptedTypes].join(
                            ",",
                        )}
                        className="hidden"
                        onChange={(event) => {
                            loadImage(event.target.files?.[0]);
                            event.target.value = "";
                        }}
                    />
                </div>

                <div className="mt-10 flex justify-center">
                    <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
                        <Lock className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        Converted on your device. Nothing is uploaded.
                    </p>
                </div>
            </div>
        </div>
    );
}
