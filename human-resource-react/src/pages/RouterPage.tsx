import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login_register_pages/Login';
import Register from './login_register_pages/Register';
import GetOffer from '../components/organisms/GetOffer';
import LandingPage from "./pre_autorize_pages/Landing";
import UserStoriesPage from "./pre_autorize_pages/UserStoriesPage";
import { useDispatch } from "react-redux";
import { HumanResources, useAppSelector } from "../store";
import { clearToken, fetchFindUserByToken, setToken } from "../store/feature/authSlice";
import AboutUsPage from './pre_autorize_pages/AboustUs';
import ContactPage from './pre_autorize_pages/ContactPage';

const AdminPage = lazy(() => import('./authorised_pages/AdminPage'));
const ManagerPage = lazy(() => import('./authorised_pages/ManagerPage'));
const RouterPage = () => {
    const dispatch = useDispatch<HumanResources>();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
           dispatch(setToken(token))
        }
    }, []);

    const isAuth = useAppSelector((state) => state.auth.isAuth);
    
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/get-offer" element={<GetOffer />} />
                <Route path="/user-stories" element={<UserStoriesPage />} />
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path='/admin-home' element={ isAuth ?  <AdminPage /> : <LandingPage />} />
                <Route path='/manager-home' element={ isAuth ?  <ManagerPage /> : <LandingPage />} />
            </Routes>
            </Suspense>
        </Router>
    );
};

export default RouterPage;
