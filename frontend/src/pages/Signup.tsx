import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { isValiEmail, validateForRegister } from "../utils/emailValidation";
import { toast } from "react-toastify";
import { register } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../types/reduxTypes";
import MetaData from "../components/common/MetaData";
import Loading from "../components/common/Loading";
import { DataBody, UserRegister } from "../types/signup";

const Signup = () => {
  const [showPassword, setshowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessErrorMessage] = useState<string>("");

  const [formData, setFormData] = useState<UserRegister>({
    name: "",
    username: "",
    email: "",
    password: "",
    isAgreeToTermsAndPrivacy: false,
  });

  // For handling Input field
  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    const fieldError: { [key: string]: string } = {};
    if (name === "email") {
      if (!value) {
        fieldError.email = "Email is required";
      } else if (isValiEmail(value)) {
        fieldError.email = "Enter a valid email address";
      }
    } else if (name === "name" && !value) {
      fieldError.name = "Name is required";
    } else if (name === "password" && !value) {
      fieldError.password = "Password is required";
    } else if (name === "username" && !value) {
      fieldError.username = "Username is required";
    } else if (name === "isAgreeToTermsAndPrivacy" && !value) {
      fieldError.country = "You must agree to the terms and privacy policy";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError[name] ? fieldError[name] : "",
    }));
  };

  const [loading, setLoading] = useState(false);

  // For handling Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("object");

    const data: DataBody = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      username: formData.username,
    };

    const validationErrors = validateForRegister(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        await dispatch(register(data, setErrorMessage, setSuccessErrorMessage));
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
      setFormData({
        name: "",
        email: "",
        password: "",
        username: "",
        isAgreeToTermsAndPrivacy: false,
      });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <MetaData title="Sign Up" />

      {/* Form Container */}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-5 text-center">Get Started</h1>
        <p className="mb-7 text-base font-medium text-center">
          Create your account
        </p>

        {errorMessage && (
          <p className="text-white text-center py-1.5 bg-red-700 font-medium text-base my-3 rounded">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="text-white text-center py-1.5 bg-green-700 font-medium text-base my-3 rounded">
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Input Fields */}
          <div className="relative mb-4">
            <input
              type="username"
              value={formData.username}
              name="username"
              onChange={handleChangeInput}
              placeholder="Username"
              className={`w-full ${
                errors.username
                  ? "border-red-500 border"
                  : "border border-gray-300"
              } px-4 py-2 rounded-md focus:outline-none`}
            />
            <FaEnvelope className="absolute top-3 right-3 text-gray-400" />
            {errors.username && (
              <p className="text-red-500 mt-1 text-sm">{errors.username}</p>
            )}
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              value={formData.name}
              onChange={handleChangeInput}
              name="name"
              autoFocus
              placeholder="Full Name"
              className={`w-full ${
                errors.name ? "border-red-500 border" : "border border-gray-300"
              } px-4 py-2 rounded-md focus:outline-none`}
            />
            <FaUser className="absolute top-3 right-3 text-gray-400" />
            {errors.name && (
              <p className="text-red-500 mt-1 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="relative mb-4">
            <input
              type="email"
              value={formData.email}
              name="email"
              onChange={handleChangeInput}
              placeholder="Email"
              className={`w-full ${
                errors.email
                  ? "border-red-500 border"
                  : "border border-gray-300"
              } px-4 py-2 rounded-md focus:outline-none`}
            />
            <FaEnvelope className="absolute top-3 right-3 text-gray-400" />
            {errors.email && (
              <p className="text-red-500 mt-1 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              onChange={handleChangeInput}
              placeholder="Password"
              name="password"
              value={formData.password}
              className={`w-full ${
                errors.password
                  ? "border-red-500 border"
                  : "border border-gray-300"
              } px-4 py-2 rounded-md focus:outline-none`}
            />
            {showPassword ? (
              <FaEye
                onClick={() => setshowPassword(!showPassword)}
                className="absolute top-3 right-3 text-gray-400 cursor-pointer"
              />
            ) : (
              <FaRegEyeSlash
                onClick={() => setshowPassword(!showPassword)}
                className="absolute top-3 right-3 text-gray-400 cursor-pointer"
              />
            )}
            {errors.password && (
              <p className="text-red-500 mt-1 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center gap-3 mb-5">
            <input
              type="checkbox"
              checked={formData.isAgreeToTermsAndPrivacy}
              name="isAgreeToTermsAndPrivacy"
              onChange={handleChangeInput}
              className="w-5 h-5"
            />
            <p className="text-sm">
              I agree to the{" "}
              <Link to="#" className="underline underline-offset-2">
                terms of service
              </Link>{" "}
              and{" "}
              <Link to="#" className="underline underline-offset-2">
                privacy policy
              </Link>
            </p>
          </div>
          {errors.isAgreeToTermsAndPrivacy && (
            <p className="text-red-500 mb-3 text-sm">
              {errors.isAgreeToTermsAndPrivacy}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white flex items-center justify-center gap-2 w-full py-2 rounded-md mb-5 hover:bg-blue-700 transition-colors"
          >
            Get Started {loading && <Loading />}
          </button>
        </form>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="font-bold underline underline-offset-2">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
