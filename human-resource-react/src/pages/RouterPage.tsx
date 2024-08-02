import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import GetOffer from './GetOffer';
import LandingPage from "./Landing";
import UserStories from "./UserStories";
import AdminPage from './AdminPage';
import getUserTypeFromToken from "../util/getUserTypeFromToken";
import {useDispatch} from "react-redux";
import {HumanResources} from "../store";
import {setToken} from "../store/feature/authSlice";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<HumanResources>()


    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token)

        if (token !== null) {
            const userType = getUserTypeFromToken(token);

            dispatch(setToken(token))

            if (userType === 'ADMIN') {
                navigate('/admin-page');
            } else {
                console.log('User is not an ADMIN.');
            }
        } else {
            console.log('No token found.');
        }
    }, []);

    return children;
};

const RouterPage = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/get-offer" element={<GetOffer />} />
                <Route path="/user-stories" element={<UserStories />} />
                <Route path="/admin-page" element={<AdminPage />} />
                <Route
                    path="*"
                    element={
                        <ProtectedRoute>
                            <LandingPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default RouterPage;
