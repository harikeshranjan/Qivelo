import { Image } from "lucide-react";

export const converterLinks = [
    {
        id: "jpg-to-png",
        name: "JPG to PNG",
        icon: Image,
        href: "/converter/jpg-to-png",
    },
    {
        id: "png-to-jpg",
        name: "PNG to JPG",
        icon: Image,
        href: "/converter/png-to-jpg",
    },
] as const;
