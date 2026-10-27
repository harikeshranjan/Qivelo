import { NavLink } from "react-router";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { ArrowLeftRight, Settings, Sparkles, Zap } from "lucide-react";
import { converterLinks } from "../static_files/sidebar";

export default function Sidebar() {
    return (
        <aside className="flex h-screen w-65 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
            {/* App header */}
            <div className="flex h-17 shrink-0 items-center gap-3 border-b border-sidebar-border px-4">
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                    <img
                        src="/icon.png"
                        alt="Qivelo Logo"
                        className="size-7 object-contain"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-base font-semibold tracking-tight">
                            Qivelo
                        </span>
                        <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            v0.1
                        </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        Offline Engine
                    </p>
                </div>

                <div
                    className="size-2 rounded-full bg-emerald-500"
                    title="Running locally"
                />
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-3 py-5">
                <div className="mb-3 flex items-center justify-between px-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Workspace
                    </span>
                </div>

                <nav className="space-y-1">
                    <Accordion defaultValue={["converter"]} className="w-full">
                        <AccordionItem
                            value="converter"
                            className="border-none"
                        >
                            <AccordionTrigger className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground hover:no-underline [&[data-state=open]>svg]:text-emerald-600 dark:[&[data-state=open]>svg]:text-emerald-400 cursor-pointer">
                                <span className="flex items-center gap-2.5">
                                    <ArrowLeftRight className="size-4" />
                                    Converter
                                </span>
                            </AccordionTrigger>

                            <AccordionContent className="pb-1 pt-1">
                                <div className="ml-4.5 space-y-1 border-l border-border pl-3">
                                    {converterLinks.map((link) => {
                                        const Icon = link.icon;

                                        return (
                                            <NavLink
                                                key={link.href}
                                                to={link.href}
                                                className={({ isActive }) =>
                                                    `group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors no-underline! hover:no-underline! ${
                                                        isActive
                                                            ? "bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400"
                                                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                                    }`
                                                }
                                            >
                                                <Icon className="size-4 shrink-0" />
                                                <span>{link.name}</span>
                                            </NavLink>
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* Future tools */}
                    <div className="px-3 pb-1 pt-5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            More tools
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        disabled
                        className="h-10 w-full justify-start gap-2.5 px-3 text-muted-foreground opacity-70"
                    >
                        <Sparkles className="size-4" />
                        AI Tools
                        <span className="ml-auto rounded border border-border px-1.5 py-0.5 text-[9px] font-medium">
                            SOON
                        </span>
                    </Button>
                </nav>
            </div>

            {/* Bottom section */}
            <div className="shrink-0 border-t border-sidebar-border p-3">
                <div className="mb-2 flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2.5">
                    <Zap className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium">100% Offline</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                            Your files stay on your device
                        </p>
                    </div>
                    <div className="size-1.5 rounded-full bg-emerald-500" />
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    className="h-10 w-full justify-start gap-2.5 px-3 text-muted-foreground hover:text-foreground"
                >
                    <Settings className="size-4" />
                    Settings
                </Button>

                <div className="mt-2 flex items-center justify-between px-3 pt-2 text-[10px] text-muted-foreground/70">
                    <span>Qivelo Desktop</span>
                    <span>v0.1.0</span>
                </div>
            </div>
        </aside>
    );
}
