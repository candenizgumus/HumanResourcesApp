import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login_register_pages/Login';
import Register from './login_register_pages/Register';
import GetOffer from '../components/organisms/GetOffer';
import LandingPage from "./pre_autorize_pages/Landing";
import UserStoriesPage from "./pre_autorize_pages/UserStoriesPage";
import AdminPage from './authorised_pages/AdminPage';
import ManagerPage from './authorised_pages/ManagerPage'; // Import ManagerPage
import { useDispatch } from "react-redux";
import { HumanResources, useAppSelector } from "../store";
import { fetchFindUserByToken, setToken } from "../store/feature/authSlice";
import AboutUsPage from './pre_autorize_pages/AboustUs';
import ContactPage from './pre_autorize_pages/ContactPage';

const RouterPage = () => {
    const dispatch = useDispatch<HumanResources>();
    //const isAuth = useAppSelector((state) => state.auth.isAuth);
    const user = useAppSelector((state) => state.auth.user);
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (token) {
            dispatch(fetchFindUserByToken(token));
            dispatch(setToken(token));
        }
    }, [token]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/get-offer" element={<GetOffer />} />
                <Route path="/user-stories" element={<UserStoriesPage />} />
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route 
                    path='/main-page' 
                    element={
                        token ? (
                            user.userType === 'ADMIN' ? <AdminPage /> : user.userType === 'MANAGER' ? <ManagerPage /> : <LandingPage/>
                        ) : <LandingPage />
                    } 
                />
            </Routes>
        </Router>
    );
};

export default RouterPage;
