import React, { Fragment, useState, useEffect } from "react";

import { FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";

// import { resetPassword } from "../../redux/user/forgotPasswordSlice";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../../types/reduxTypes";
import MetaData from "../common/MetaData";
import Loading from "../common/Loading";
import { resetPassword } from "../../redux/userSlice";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { success, error } = useSelector((state: RootState) => state.user);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingMain, setLoadingMain] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const resetPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid token");
      return;
    }
    const passwords = {
      password,
      confirmPassword,
    };

    try {
      setLoadingMain(true);
      await dispatch(resetPassword(token, passwords, navigate));

      setLoadingMain(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMain(false);
    }
  };

  useEffect(() => {
    if (success) {
      toast.success("Password Updated Successfully");
      navigate("/login");
    }

    console.log(error, "error aaya");

    if (error) {
      setErrorMessage(error.message || "An unknown error occurred");
    }
  }, [dispatch, navigate, success, error]);

  return (
    <Fragment>
      <MetaData title="Reset Password" />
      <div className="flex items-center justify-center w-screen h-screen bg-gray-200 fixed top-0 left-0">
        <div className="bg-white w-96 h-80  shadow-lg p-8 rounded-lg">
          <h2
            className={`text-center text-gray-600 font-semibold text-lg pb-2 ${
              errorMessage ? "" : "mb-6"
            }`}
          >
            Reset Password
          </h2>

          {errorMessage && (
            <p className="text-white text-center py-1.5 bg-red-700 font-medium text-base mb-3">
              {errorMessage}
            </p>
          )}

          <form
            className="flex flex-col space-y-6"
            onSubmit={resetPasswordSubmit}
          >
            <div className="relative flex items-center">
              <FaLock className="absolute left-3 text-gray-500 text-xl" />
              <input
                type="password"
                placeholder="New Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative flex items-center">
              <FaLock className="absolute left-3 text-gray-500 text-xl" />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-[var(--button-bg-color)] flex items-center gap-2 justify-center text-black py-2 px-4 rounded-md hover:bg-[var(--button-bg-color)] transition-all shadow-md cursor-pointer"
            >
              Update {loadingMain ? <Loading /> : ""}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ResetPassword;
