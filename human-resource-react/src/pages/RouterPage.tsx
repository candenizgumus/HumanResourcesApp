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
import {HumanResources, useAppSelector} from "../store";
import {setToken} from "../store/feature/authSlice";


const RouterPage = () => {
    const dispatch = useDispatch<HumanResources>();
    const isAuth = useAppSelector((state) => state.auth.isAuth);
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            dispatch(setToken(token));
        }
    },[]);
    const isLogin = useAppSelector((state) => state.auth.isAuth);
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/get-offer" element={<GetOffer />} />
                <Route path="/user-stories" element={<UserStories />} />
                <Route path="/admin-page" element={isAuth ? <AdminPage /> : <LandingPage />} />

            </Routes>
        </Router>
    );
};

export default RouterPage;
