import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import GetOffer from './GetOffer';
import LandingPage from "./Landing";
import AdminPage from './AdminPage';



const RouterPage = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/get-offer" element={<GetOffer />} />
                <Route path="/admin-page" element={<AdminPage />} />

            </Routes>
        </Router>
    );
};

export default RouterPage;