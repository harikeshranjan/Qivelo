import ImageConverter from "../components/image-converter";
import { convertJpgToPng } from "../lib/image-converters";

export default function JpgToPngPage() {
    return (
        <ImageConverter
            title="JPG to PNG"
            description="Convert a JPEG image to PNG at its original dimensions."
            inputFormat="JPG"
            outputFormat="PNG"
            acceptedTypes={["image/jpeg", "image/jpg"]}
            acceptedExtensions={[".jpg", ".jpeg"]}
            outputExtension="png"
            convert={convertJpgToPng}
        />
    );
}
