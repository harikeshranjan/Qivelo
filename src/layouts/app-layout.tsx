import { ThemeProvider } from "../providers/theme-provider";
import Sidebar from "../components/sidebar";
import { Outlet } from "react-router";

export default function AppLayout() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <main className="flex min-h-screen">
                <Sidebar />

                <section className="min-w-0 flex-1">
                    <Outlet />
                </section>
            </main>
            Ï
        </ThemeProvider>
    );
}
