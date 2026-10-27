import { useTheme } from "../providers/theme-provider";
import { Switch } from "./ui/switch";
import { Moon, Sun } from "lucide-react";

export default function ModeToggle() {
    const { theme, setTheme } = useTheme();

    const isDark = theme === "dark";

    return (
        <div className="flex items-center gap-2">
            <Sun className="size-4 text-muted-foreground" />

            <Switch
                checked={isDark}
                onCheckedChange={(checked: boolean) =>
                    setTheme(checked ? "dark" : "light")
                }
                aria-label="Toggle dark mode"
                className="cursor-pointer"
            />

            <Moon className="size-4 text-muted-foreground" />
        </div>
    );
}
