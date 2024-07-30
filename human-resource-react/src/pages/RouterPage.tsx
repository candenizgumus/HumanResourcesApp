
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LandingPage from "./Landing";
import Login from "./Login";
import Register from "./Register";


function RouterPage() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}

export default RouterPage;

