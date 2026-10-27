import ModeToggle from "../components/mode-toggle";
import {
    Monitor,
    HardDrive,
    ShieldCheck,
    Info,
    Palette,
    Database,
    ChevronRight,
    Zap,
    Sun,
    Moon,
} from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="mx-auto w-full max-w-4xl space-y-8 p-6 md:p-10">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Monitor className="size-4" />
                    Workspace
                    <ChevronRight className="size-3.5" />
                    <span className="text-foreground">Settings</span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

                <p className="text-sm text-muted-foreground">
                    Customize your Qivelo experience.
                </p>
            </div>

            {/* Appearance */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Palette className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <h2 className="text-lg font-semibold tracking-tight">
                        Appearance
                    </h2>
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="flex items-center gap-4 p-5 sm:p-6">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                            <Palette className="size-5 text-emerald-600 dark:text-emerald-400" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold">
                                Theme preference
                            </h3>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                Choose the appearance that feels right for you.
                            </p>
                        </div>

                        <div className="shrink-0">
                            <ModeToggle />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 border-t border-border bg-muted/30 px-5 py-3 sm:px-6">
                        <Sun className="size-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                            Light
                        </span>

                        <div className="mx-1 h-3 w-px bg-border" />

                        <Moon className="size-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                            Dark
                        </span>

                        <span className="ml-auto text-xs text-muted-foreground">
                            Applies instantly
                        </span>
                    </div>
                </div>
            </section>

            {/* Storage */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Database className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <h2 className="text-lg font-semibold">Storage</h2>
                </div>

                <div className="divide-y divide-border rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-4 p-4 sm:p-5">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <HardDrive className="size-5 text-muted-foreground" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">Local storage</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Your files are processed locally on your device.
                            </p>
                        </div>

                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Local
                        </span>
                    </div>

                    <div className="flex items-center gap-4 p-4 sm:p-5">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <ShieldCheck className="size-5 text-muted-foreground" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">Privacy</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Qivelo is designed to work offline.
                            </p>
                        </div>

                        <Zap className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    </div>
                </div>
            </section>

            {/* About */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Info className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <h2 className="text-lg font-semibold">About</h2>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                    <div className="flex items-center gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                            <img
                                src="/icon.png"
                                alt="Qivelo logo"
                                className="size-9 object-contain"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-semibold">
                                    Qivelo
                                </h3>
                                <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                    v0.1.0
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Your private, offline conversion workspace.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                        <span className="text-xs text-muted-foreground">
                            Application status
                        </span>

                        <span className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <span className="size-2 rounded-full bg-emerald-500" />
                            Ready to use
                        </span>
                    </div>
                </div>
            </section>

            <p className="pb-4 text-center text-xs text-muted-foreground">
                Qivelo · Built for privacy.
            </p>
        </div>
    );
}
