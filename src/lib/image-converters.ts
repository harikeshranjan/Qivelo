import { ConversionResult } from "@/components/image-converter";

async function convertImage(
    file: File,
    outputMimeType: "image/png" | "image/jpeg",
    backgroundColor?: string,
): Promise<ConversionResult> {
    const sourceUrl = URL.createObjectURL(file);

    try {
        const img = new Image();

        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () =>
                reject(new Error("Could not load the selected image."));

            img.src = sourceUrl;
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const context = canvas.getContext("2d");

        if (!context) {
            throw new Error(
                "Your device could not initialize image conversion.",
            );
        }

        // JPEG does not support transparency.
        // Fill transparent areas before drawing when a background is specified.
        if (backgroundColor) {
            context.fillStyle = backgroundColor;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        context.drawImage(img, 0, 0);

        const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(new Error("Image conversion failed."));
                }
            }, outputMimeType);
        });

        if (blob.type !== outputMimeType) {
            throw new Error("The requested image format is not supported.");
        }

        return {
            blob,
            width: img.naturalWidth,
            height: img.naturalHeight,
        };
    } finally {
        URL.revokeObjectURL(sourceUrl);
    }
}

export function convertJpgToPng(file: File): Promise<ConversionResult> {
    return convertImage(file, "image/png");
}

export function convertPngToJpg(file: File): Promise<ConversionResult> {
    return convertImage(file, "image/jpeg", "#ffffff");
}
