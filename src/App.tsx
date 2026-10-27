import { BrowserRouter, Route, Routes } from "react-router";
import AppLayout from "./layouts/app-layout";
import HomePage from "./pages/homepage";
import SettingsPage from "./pages/settings";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
