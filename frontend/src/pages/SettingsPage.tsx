import React, { useEffect, useState } from "react";
import { isValiEmail, validateForUpdateUser } from "../utils/emailValidation";
import { useDispatch } from "react-redux";
import { getNames } from "country-list";
import { toast } from "react-toastify";

import { FaUser, FaEnvelope } from "react-icons/fa";
// import { updateProfile } from "../redux/user/profileSlice";
import { UpdateUserBody } from "../types/signup";
import { User } from "../types/userTypes";
import { AppDispatch } from "../types/reduxTypes";
import MetaData from "../components/common/MetaData";
import ProfileSection from "../components/Users/ProfileSection";
import ChangePassword from "../components/Users/ChangePassword";
import { loadUser, updateProfile } from "../redux/userSlice";

interface SettingPageBody {
  user: User | null;
  open: boolean;
  selectedProjectDetails: any;
}

const SettingsPage = ({
  user,
  open,
  selectedProjectDetails,
}: SettingPageBody) => {
  const countries = getNames();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<UpdateUserBody>({
    first_name: "",
    last_name: "",
    email: "",
    country: "",
    status: "",
  });

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    } else if (name === "first_name" && !value) {
      fieldError.first_name = "First Name is required";
    } else if (name === "last_name" && !value) {
      fieldError.last_name = "Last Name is required";
    }
    //  else if (name === "password" && !value) {
    //   fieldError.password = "Password is required";
    // }
    else if (name === "status" && !value) {
      fieldError.status = "Status is required";
    } else if (name === "country" && !value) {
      fieldError.country = "Country is required";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError[name] ? fieldError[name] : "",
    }));
  };

  const [isEditable, setIsEditable] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      ...formData,
      user_type: user?.user_type,
      auth_type: user?.auth_type,
      password: user?.password_hash,
    };

    const validationErrors = validateForUpdateUser(formData);
    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);

        await dispatch(updateProfile(data));

        toast.success("User updated successfully");
        setIsEditable(false);
        dispatch(loadUser());
      } catch (error: any) {
        toast.error(error?.response?.data?.message);

        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setErrors(validationErrors);
    }
  };

  const toggleEdit = () => {
    setIsEditable((prev) => !prev);
  };

  useEffect(() => {
    setFormData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      country: user?.country || "",
      status: user?.status || "",
    });
  }, [user]);

  const [isChangePasswordModal, setIsChangePasswordModal] = useState(false);

  return (
    <div
      className={`${
        !open
          ? "w-[calc(100%-80px)] left-20 ml-20"
          : "w-[calc(100%-288px)] ml-72 left-72"
      } px-10 h-auto space-y-4 pt-5 pb-20 sidebar-scrollbar`}
    >
      <MetaData title="User Profile" />

      <div className="flex flex-col items-center justify-center">
        <ProfileSection
          isEditable={isEditable}
          toggleEdit={toggleEdit}
          user={user}
          setIsChangePasswordModal={setIsChangePasswordModal}
          selectedProjectDetails={selectedProjectDetails}
        />

        <div className="w-full mt-10 p-6 bg-white shadow-md rounded-md">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold mb-6">
              Personal Information
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-5">
              <div className="relative mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={handleChangeInput}
                    name="first_name"
                    disabled={!isEditable}
                    placeholder="First Name"
                    className={`w-full  ${
                      errors.first_name
                        ? "border-[var(--dengrous-color)] border"
                        : " border border-gray-300"
                    }  px-4 py-2 rounded-md focus:outline-none`}
                  />
                  <FaUser className="absolute top-3 right-3 text-gray-400" />
                  {errors.first_name && (
                    <p className="text-[var(--dengrous-color)] mt-1 text-sm">
                      {errors.first_name}
                    </p>
                  )}
                </div>
              </div>
              <div className="relative mb-4">
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={handleChangeInput}
                  name="last_name"
                  disabled={!isEditable}
                  placeholder="Last Name"
                  className={`w-full  ${
                    errors.last_name
                      ? "border-[var(--dengrous-color)] border"
                      : " border border-gray-300"
                  }  px-4 py-2 rounded-md focus:outline-none`}
                />
                <FaUser className="absolute top-3 right-3 text-gray-400" />
                {errors.last_name && (
                  <p className="text-[var(--dengrous-color)] mt-1 text-sm">
                    {errors.last_name}
                  </p>
                )}
              </div>
              <div className="relative mb-4">
                <input
                  type="email"
                  value={formData.email}
                  name="email"
                  disabled={!isEditable}
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
              {/* <div className="relative mb-4">
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
            </div> */}
              <div className="relative mb-6">
                <select
                  value={formData.country}
                  name="country"
                  onChange={handleChangeInput}
                  disabled={!isEditable}
                  className={`w-full  ${
                    errors.country
                      ? "border-[var(--dengrous-color)] border"
                      : " border border-gray-300"
                  }  px-4  py-2 rounded-md focus:outline-none`}
                >
                  <option disabled value="">
                    Select Country
                  </option>
                  {countries.map((c, index) => (
                    <option key={index} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-[var(--dengrous-color)] mt-1 text-sm">
                    {errors.country}
                  </p>
                )}
              </div>
              <div className="relative mb-6">
                <select
                  value={formData.status}
                  disabled={!isEditable}
                  name="status"
                  onChange={handleChangeInput}
                  className={`w-full  ${
                    errors.status
                      ? "border-[var(--dengrous-color)] border"
                      : " border border-gray-300"
                  }  px-4  py-2 rounded-md focus:outline-none`}
                >
                  <option disabled value="">
                    Select Status
                  </option>
                  <option value="active">Active</option>
                  <option value="suspend">Suspend</option>
                </select>
                {errors.status && (
                  <p className="text-[var(--dengrous-color)] mt-1 text-sm">
                    {errors.status}
                  </p>
                )}
              </div>
            </div>
            {isEditable && (
              <div className="flex justify-end mt-5 bg-gray-100 p-10">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {isChangePasswordModal && (
        <ChangePassword
          isChangePasswordModal={isChangePasswordModal}
          setIsChangePasswordModal={setIsChangePasswordModal}
        />
      )}

      <div className="flex flex-col gap-1 mt-5 text-xl font-bold leading-[24px] items-start text-[#424242]">
        <div>Last LoggedIn: {user?.last_login_at}</div>
        <div>Created At: {user?.created_at}</div>
      </div>
    </div>
  );
};

export default SettingsPage;
