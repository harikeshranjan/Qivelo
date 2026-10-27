import { BrowserRouter, Route, Routes } from "react-router";
import AppLayout from "./layouts/app-layout";
import HomePage from "./pages/homepage";
import SettingsPage from "./pages/settings";
import JpgToPngPage from "./pages/jpg-to-png";
import PngToJpgPage from "./pages/png-to-jpg";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/settings" element={<SettingsPage />} />

                    <Route path="converter">
                        <Route path="jpg-to-png" element={<JpgToPngPage />} />
                        <Route path="png-to-jpg" element={<PngToJpgPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
