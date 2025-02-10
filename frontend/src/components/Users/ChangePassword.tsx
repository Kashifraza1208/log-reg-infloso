import React, { useState } from "react";
import xClose from "../../assets/x-close.svg";
import { toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../types/reduxTypes";
import { updatePassword } from "../../redux/userSlice";

interface ChangePasswordBody {
  isChangePasswordModal: boolean;
  setIsChangePasswordModal: (val: boolean) => void;
}

const ChangePassword = ({
  isChangePasswordModal,
  setIsChangePasswordModal,
}: ChangePasswordBody) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    const passoword = {
      currentPassword,
      newPassword,
      confirmPassword,
    };

    try {
      await dispatch(updatePassword(passoword));

      setSuccessMessage("Password changed successfully.");
      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangePasswordModal(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      setError(err?.response?.data?.message);
    }
  };

  const handleCloseIsChangePasswordModal = () => {
    setIsChangePasswordModal(false);
  };

  return (
    <div
      className={`fixed overflow-auto left-0 top-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50 z-50 ${
        isChangePasswordModal ? "block" : "hidden"
      }`}
    >
      <div className="mx-auto w-[500px] bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-6 ">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Change Password
          </h2>
          <img
            className="cursor-pointer hover:bg-red-600 hover:text-white"
            onClick={handleCloseIsChangePasswordModal}
            src={xClose}
            alt="closeIcon"
          />
        </div>

        <div className="flex justify-center items-center  ">
          <div className="w-full max-w-md px-6 pb-10  rounded-lg">
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {successMessage && (
              <p className="text-green-500 mb-4 text-center">
                {successMessage}
              </p>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="currentPassword"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="newPassword"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
