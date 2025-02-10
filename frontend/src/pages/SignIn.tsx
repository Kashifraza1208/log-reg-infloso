import React, { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";

import { isValiEmail, validateForLogin } from "../utils/emailValidation";

import { useDispatch, useSelector } from "react-redux";
import MetaData from "../components/common/MetaData";
import Loading from "../components/common/Loading";

import { AppDispatch, RootState } from "../types/reduxTypes";
import { UserLogin } from "../types/signin";
import { login } from "../redux/userSlice";

const SignIn = () => {
  const [showPassword, setshowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<UserLogin>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const saveEmail = localStorage.getItem("email");
    const savePassword = localStorage.getItem("password");
    if (saveEmail) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: saveEmail,
        password: savePassword || "",
      }));
      setRememberMe(true);
    }
  }, []);

  //For handling Input field
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const fieldError: { [key: string]: string } = {};
    if (name === "email") {
      if (!value) {
        fieldError.email = "Email is required";
      } else if (isValiEmail(value)) {
        fieldError.email = "Enter a valid email address";
      }
    } else if (name === "password" && !value) {
      fieldError.password = "Password is required";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError[name] ? fieldError[name] : "",
    }));
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  //For handling Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForLogin(formData);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        await dispatch(
          login(
            formData.email,
            formData.password,
            setErrorMessage,
            navigate,
            from,
            rememberMe
          )
        );
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setErrors(validationErrors);
    }
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <MetaData title="Login" />

      {/* Right Section */}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-5 text-center">Welcome Back</h1>
        <p
          className={`${
            errorMessage ? "mb-7" : "mb-4"
          }  text-base font-medium text-center`}
        >
          Login with your credentials
        </p>

        {errorMessage && (
          <p className="text-white text-center py-1.5 bg-red-500 font-medium text-base my-3">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Input Fields */}

          <div className="relative mb-4">
            <input
              type="email"
              value={formData.email}
              name="email"
              autoFocus
              onChange={handleChangeInput}
              placeholder="Email"
              className={`w-full  ${
                errors.email
                  ? "border-[var(--dengrous-color)] border"
                  : " border border-gray-300"
              }  px-4 py-2 rounded-md focus:outline-none`}
            />
            <FaEnvelope className="absolute top-3 right-3 text-gray-400" />
            {errors.email && (
              <p className="text-[var(--dengrous-color)] mt-1 text-sm">
                {errors.email}
              </p>
            )}
          </div>

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              onChange={handleChangeInput}
              placeholder="Password"
              name="password"
              value={formData.password}
              className={`w-full  ${
                errors.password
                  ? "border-[var(--dengrous-color)] border"
                  : " border border-gray-300"
              }  px-4 py-2 rounded-md focus:outline-none`}
            />
            {showPassword ? (
              <FaEye
                onClick={() => setshowPassword(!showPassword)}
                className="absolute top-3 right-3 text-gray-400"
              />
            ) : (
              <FaRegEyeSlash
                onClick={() => setshowPassword(!showPassword)}
                className="absolute top-3 right-3 text-gray-400"
              />
            )}
            {errors.password && (
              <p className="text-[var(--dengrous-color)] mt-1 text-sm">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between  mb-6">
            <div className="flex items-center justify-start gap-2">
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <span className="text-sm  font-normal">Remember me</span>
            </div>
            <Link
              to="/forgot/password"
              className="underline underline-offset-2"
            >
              Forgot Password?
            </Link>{" "}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white flex items-center justify-center gap-2 w-full py-2 rounded-md mb-5 hover:bg-blue-700 transition-colors"
          >
            Log In {loading && <Loading />}
          </button>
        </form>

        <p className="text-center">
          Don’t have and account?{" "}
          <Link to="/signup" className="font-bold underline underline-offset-2">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
