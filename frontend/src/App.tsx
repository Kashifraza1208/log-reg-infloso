import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";

import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "./types/reduxTypes";
import ProtectedRoute from "./components/Route/ProtectedRoute";

import ForgotPassword from "./components/Users/ForgotPassword";
import ResetPassword from "./components/Users/ResetPassword";

import EmailVerify from "./pages/VerifyEmail";
import HeroSection from "./pages/HeroSection";
import { setupInterceptors } from "./api/axios";
import SuccessToken from "./pages/SuccessToken";
import { loadUser } from "./redux/userSlice";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setupInterceptors(dispatch);
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<SignIn />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot/password" element={<ForgotPassword />} />
          <Route path="/reset/password/:token" element={<ResetPassword />} />
          <Route path="/verify/email/:token" element={<EmailVerify />} />

          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <HeroSection />{" "}
              </ProtectedRoute>
            }
          />

          <Route
            path="/success"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SuccessToken />{" "}
              </ProtectedRoute>
            }
          />
        </Routes>

        <ToastContainer />
      </BrowserRouter>
    </div>
  );
};

export default App;
