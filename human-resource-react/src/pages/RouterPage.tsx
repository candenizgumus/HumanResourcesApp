import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login_register_pages/Login';
import GetOffer from '../pages/pre_autorize_pages/GetOffer'
import LandingPage from "./pre_autorize_pages/Landing";
import UserStoriesPage from "./pre_autorize_pages/UserStoriesPage";
import { useDispatch } from "react-redux";
import { HumanResources, useAppSelector } from "../store";
import { setToken } from "../store/feature/authSlice";
import AboutUsPage from './pre_autorize_pages/AboustUs';
import ContactPage from './pre_autorize_pages/ContactPage';
import Loader from '../components/atoms/loader/Loader';
import PasswordResetPage from "./login_register_pages/PasswordResetPage";
import Features from "./pre_autorize_pages/features/Features"
import FeatureRecruitment from "./pre_autorize_pages/features/FeatureRecruitment"
import FeaturePerformance from "./pre_autorize_pages/features/FeaturePerformance"
import FeatureShift from "./pre_autorize_pages/features/FeatureShift"
import EmployeePage from "./authorised_pages/EmployeePage";
import UserStoryDetailPage from "../pages/pre_autorize_pages/UserStoryDetailPage"
import SlideDetail from "../components/molecules/ManagerComponents/SlideDetail"
import '../util/i18n';
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
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/get-offer" element={<GetOffer />} />
                    <Route path="/user-stories" element={<UserStoriesPage />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/features/Recruitment" element={<FeatureRecruitment />} />
                    <Route path="/features/Performance" element={<FeaturePerformance />} />
                    <Route path="/features/Shift" element={<FeatureShift />} />
                    <Route path="/about-us" element={<AboutUsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path='/admin-home' element={isAuth ? <AdminPage /> : <LandingPage />} />
                    <Route path='/manager-home' element={isAuth ? <ManagerPage /> : <LandingPage />} />
                    <Route path='/employee-home' element={isAuth ? <EmployeePage /> : <LandingPage />} />
                    <Route path={'/password-reset'} element={<PasswordResetPage />} />
                    <Route path="/user-stories/:companyName" element={<UserStoryDetailPage />} />
                    <Route path="/slides/:slideId/:companyId/:userName" element={<SlideDetail />} />
                    {/*<Route path="/slides/:slideId" element={<ShowSlide />} />*/}
                </Routes>
            </Suspense>
        </Router>
    );
};

export default RouterPage;
