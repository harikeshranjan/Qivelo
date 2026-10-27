import ImageConverter from "../components/image-converter";
import { convertPngToJpg } from "../lib/image-converters";

export default function PngToJpgPage() {
    return (
        <ImageConverter
            title="PNG to JPG"
            description="Convert a PNG image to JPEG with a white background for transparent areas."
            inputFormat="PNG"
            outputFormat="JPG"
            acceptedTypes={["image/png"]}
            acceptedExtensions={[".png"]}
            outputExtension="jpg"
            convert={convertPngToJpg}
        />
    );
}
