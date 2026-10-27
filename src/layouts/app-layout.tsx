import { ThemeProvider } from "../providers/theme-provider";
import Sidebar from "../components/sidebar";
import { Outlet } from "react-router";

export default function AppLayout() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <main className="min-w-0 flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </ThemeProvider>
    );
}
