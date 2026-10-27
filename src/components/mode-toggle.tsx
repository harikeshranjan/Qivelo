import { useTheme } from "@/providers/theme-provider";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export default function ModeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <Button variant={"outline"} onClick={toggleTheme}>
            {theme === "light" ? <Sun /> : <Moon />}
        </Button>
    );
}
