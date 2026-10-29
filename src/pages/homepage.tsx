import { ArrowUpRight, Fingerprint, ShieldCheck, WifiOff } from "lucide-react";

export default function HomePage() {
    return (
        <main className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden px-6 py-12 sm:px-10">
            {/* Ambient background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="absolute left-1/2 top-[42%] size-105 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.07] blur-[100px] dark:bg-emerald-400/9" />

                <div className="absolute right-[8%] top-[12%] size-48 rounded-full bg-emerald-500/4 blur-[80px]" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-3xl">
                {/* Brand mark */}
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-9">
                        <div className="absolute -inset-4 rounded-[2rem] bg-emerald-500/10 blur-xl" />

                        <div className="relative flex size-20 items-center justify-center rounded-[1.65rem] border border-emerald-500/20 bg-card shadow-xl shadow-emerald-950/5">
                            <img
                                src="/icon.png"
                                alt="Qivelo"
                                className="size-12 object-contain"
                            />
                        </div>
                    </div>

                    {/* Welcome heading */}
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/6 px-3 py-1.5">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                            Your private workspace
                        </span>
                    </div>

                    <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-6xl sm:leading-[1.08]">
                        Your files.
                        <br />
                        <span className="bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-emerald-300 dark:to-teal-400">
                            Your rules.
                        </span>
                    </h1>

                    <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
                        Welcome to Qivelo. A simpler way to work with your
                        files, built around privacy, simplicity, and the freedom
                        to work offline.
                    </p>
                </div>

                {/* Decorative format illustration */}
                <div
                    aria-hidden="true"
                    className="relative mx-auto my-12 flex h-40 max-w-lg items-center justify-center sm:my-14 sm:h-48"
                >
                    {/* Orbit rings */}
                    <div className="absolute size-36 rounded-full border border-border/70 sm:size-44" />
                    <div className="absolute size-56 rounded-full border border-dashed border-border/60 sm:size-64" />

                    {/* Center emblem */}
                    <div className="relative z-10 flex size-18 items-center justify-center rounded-2xl border border-emerald-500/20 bg-card shadow-lg shadow-emerald-950/5 sm:size-20">
                        <img
                            src="/icon.png"
                            alt=""
                            className="size-11 object-contain sm:size-12"
                        />
                    </div>

                    {/* Floating format tiles */}
                    <div className="absolute left-[12%] top-[12%] flex -rotate-12 items-center gap-2 rounded-xl border border-border/80 bg-card/90 px-3 py-2.5 shadow-lg backdrop-blur-md sm:left-[18%]">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-violet-500/10 text-[10px] font-bold text-violet-600 dark:text-violet-400">
                            PDF
                        </span>
                        <div>
                            <p className="text-xs font-semibold">Documents</p>
                            <p className="text-[10px] text-muted-foreground">
                                Your files
                            </p>
                        </div>
                    </div>

                    <div className="absolute right-[9%] top-[13%] flex rotate-6 items-center gap-2 rounded-xl border border-border/80 bg-card/90 px-3 py-2.5 shadow-lg backdrop-blur-md sm:right-[16%]">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                            PNG
                        </span>
                        <div>
                            <p className="text-xs font-semibold">Images</p>
                            <p className="text-[10px] text-muted-foreground">
                                Made simple
                            </p>
                        </div>
                    </div>

                    <div className="absolute bottom-[3%] left-[25%] flex rotate-3 items-center gap-2 rounded-xl border border-border/80 bg-card/90 px-3 py-2.5 shadow-lg backdrop-blur-md sm:left-[29%]">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-sky-500/10 text-[10px] font-bold text-sky-600 dark:text-sky-400">
                            JPG
                        </span>
                        <span className="text-xs font-medium">
                            No cloud needed
                        </span>
                    </div>

                    {/* Orbit dots */}
                    <span className="absolute left-[25%] top-[34%] size-2 rounded-full bg-emerald-500/70" />
                    <span className="absolute right-[24%] bottom-[28%] size-1.5 rounded-full bg-emerald-500/50" />
                    <span className="absolute right-[32%] top-[4%] size-1 rounded-full bg-muted-foreground/50" />
                </div>

                {/* Privacy principles */}
                <div className="mx-auto grid max-w-xl grid-cols-3 gap-3 border-t border-border/70 pt-6 sm:gap-6 sm:pt-7">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex size-10 items-center justify-center rounded-xl border border-border/70 bg-card">
                            <ShieldCheck className="size-4.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-xs font-medium text-foreground sm:text-sm">
                            Private by design
                        </p>
                        <p className="hidden text-[11px] text-muted-foreground sm:block">
                            Your files stay yours
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex size-10 items-center justify-center rounded-xl border border-border/70 bg-card">
                            <WifiOff className="size-4.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-xs font-medium text-foreground sm:text-sm">
                            Works offline
                        </p>
                        <p className="hidden text-[11px] text-muted-foreground sm:block">
                            No cloud dependency
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex size-10 items-center justify-center rounded-xl border border-border/70 bg-card">
                            <Fingerprint className="size-4.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-xs font-medium text-foreground sm:text-sm">
                            No account
                        </p>
                        <p className="hidden text-[11px] text-muted-foreground sm:block">
                            Just open and use
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground/70">
                    <span>Made for your files</span>
                    <span className="text-border">·</span>
                    <span>Built to stay local</span>
                    <ArrowUpRight className="size-3" />
                </div>
            </div>
        </main>
    );
}
