import { useEffect, useRef, useState } from "react";
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
import { Button } from "../components/ui/button";

type ImageFile = {
    file: File;
    preview: string;
    width: number | null;
    height: number | null;
    pngUrl: string | null;
    pngSize: number | null;
};

type View = "original" | "png";

const primaryButton =
    "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-emerald-950 dark:hover:bg-emerald-400";

const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const revokeImage = (image: ImageFile | null) => {
    if (!image) return;
    URL.revokeObjectURL(image.preview);
    if (image.pngUrl) URL.revokeObjectURL(image.pngUrl);
};

export default function JpgToPngPage() {
    const inputRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<ImageFile | null>(null);
    const jobRef = useRef(0);
    const dragDepth = useRef(0);

    const [image, setImage] = useState<ImageFile | null>(null);
    const [view, setView] = useState<View>("png");
    const [isDragging, setIsDragging] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState("");

    imageRef.current = image;

    // Release object URLs when leaving the page
    useEffect(() => {
        return () => revokeImage(imageRef.current);
    }, []);

    const convert = async (preview: string, jobId: number) => {
        setIsConverting(true);

        try {
            const img = new Image();
            img.src = preview;

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () =>
                    reject(new Error("Could not load the selected image."));
            });

            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const context = canvas.getContext("2d");

            if (!context) {
                throw new Error(
                    "Your browser could not initialize image conversion.",
                );
            }

            context.drawImage(img, 0, 0);

            const pngBlob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error("PNG conversion failed."));
                }, "image/png");
            });

            // A newer image was picked while this one was converting
            if (jobId !== jobRef.current) return;

            const pngUrl = URL.createObjectURL(pngBlob);

            setImage((current) => {
                if (!current || current.preview !== preview) {
                    URL.revokeObjectURL(pngUrl);
                    return current;
                }

                return {
                    ...current,
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    pngUrl,
                    pngSize: pngBlob.size,
                };
            });
            setView("png");
        } catch (err) {
            if (jobId !== jobRef.current) return;
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong during conversion.",
            );
        } finally {
            if (jobId === jobRef.current) setIsConverting(false);
        }
    };

    const loadImage = (file?: File) => {
        if (!file) return;

        setError("");

        if (!["image/jpeg", "image/jpg"].includes(file.type)) {
            setError("Please select a JPG or JPEG image.");
            return;
        }

        if (file.size === 0) {
            setError("This file is empty. Please select another image.");
            return;
        }

        revokeImage(imageRef.current);

        const preview = URL.createObjectURL(file);
        const jobId = ++jobRef.current;

        setImage({
            file,
            preview,
            width: null,
            height: null,
            pngUrl: null,
            pngSize: null,
        });
        setView("original");

        void convert(preview, jobId);
    };

    const downloadImage = () => {
        if (!image?.pngUrl) return;

        const anchor = document.createElement("a");
        const baseName = image.file.name.replace(/\.(jpe?g)$/i, "");

        anchor.href = image.pngUrl;
        anchor.download = `${baseName}.png`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    };

    const removeImage = () => {
        jobRef.current++;
        revokeImage(image);
        setImage(null);
        setError("");
        setIsConverting(false);

        if (inputRef.current) inputRef.current.value = "";
    };

    const dropHandlers = {
        onDragEnter: (event: React.DragEvent) => {
            event.preventDefault();
            dragDepth.current++;
            setIsDragging(true);
        },
        onDragOver: (event: React.DragEvent) => {
            event.preventDefault();
        },
        onDragLeave: (event: React.DragEvent) => {
            event.preventDefault();
            dragDepth.current = Math.max(0, dragDepth.current - 1);
            if (dragDepth.current === 0) setIsDragging(false);
        },
        onDrop: (event: React.DragEvent) => {
            event.preventDefault();
            dragDepth.current = 0;
            setIsDragging(false);
            loadImage(event.dataTransfer.files[0]);
        },
    };

    const isReady = !!image?.pngUrl;
    const shownSrc =
        image && view === "png" && image.pngUrl ? image.pngUrl : image?.preview;

    const sizeDelta =
        image && image.pngSize !== null
            ? ((image.pngSize - image.file.size) / image.file.size) * 100
            : null;

    const details: { label: string; value: string }[] = image
        ? [
              {
                  label: "Dimensions",
                  value:
                      image.width !== null
                          ? `${image.width} × ${image.height} px`
                          : "—",
              },
              { label: "JPG size", value: formatBytes(image.file.size) },
              {
                  label: "PNG size",
                  value:
                      image.pngSize !== null ? formatBytes(image.pngSize) : "—",
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
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Header */}
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
                    JPG to PNG
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    Convert a JPEG image to PNG at its original dimensions.
                </p>
            </header>

            <div {...dropHandlers}>
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
                                : "Drop a JPG here, or click to browse"}
                        </span>

                        <span className="mt-1.5 text-sm text-muted-foreground">
                            JPG or JPEG files
                        </span>

                        <span
                            className={`mt-6 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium transition-colors ${primaryButton}`}
                        >
                            Select image
                        </span>
                    </button>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
                        {/* Preview */}
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
                                    aria-label="Preview"
                                    className="inline-flex rounded-lg bg-muted p-0.5 text-sm"
                                >
                                    {(
                                        [
                                            ["original", "JPG"],
                                            ["png", "PNG"],
                                        ] as const
                                    ).map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            role="tab"
                                            aria-selected={view === value}
                                            disabled={
                                                value === "png" && !isReady
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
                                <img
                                    src={shownSrc}
                                    alt={
                                        view === "png" && isReady
                                            ? "Converted PNG preview"
                                            : "Original JPG preview"
                                    }
                                    className="max-h-[28rem] max-w-full rounded object-contain"
                                />
                            </div>
                        </section>

                        {/* Result */}
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
                                            ? "Download PNG"
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
                                Converting to PNG doesn&apos;t restore detail
                                already lost to JPEG compression, so the file is
                                usually larger.
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
                    accept=".jpg,.jpeg,image/jpeg"
                    className="hidden"
                    onChange={(event) => {
                        loadImage(event.target.files?.[0]);
                        event.target.value = "";
                    }}
                />
            </div>

            <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="size-3.5 shrink-0" />
                Images are converted in your browser and never uploaded.
            </p>
        </div>
    );
}
