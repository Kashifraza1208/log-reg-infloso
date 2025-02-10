import React, { Fragment, useState, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../types/reduxTypes";
import MetaData from "../common/MetaData";
import Loading from "../common/Loading";
import { forgotPassword } from "../../redux/userSlice";

const ForgotPassword = () => {
  const { error, message } = useSelector((state: RootState) => state.user);

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessErrorMessage] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const [loadingMain, setLoadingMain] = useState(false);

  const forgotPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoadingMain(true);
      await dispatch(
        forgotPassword(email, setErrorMessage)
      );

      setLoadingMain(false);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoadingMain(false);
    }
  };

  useEffect(() => {
    if (message) {
      setSuccessErrorMessage(message);
    }
  }, [dispatch, error, message]);

  return (
    <Fragment>
      <MetaData title="Forgot Password" />
      <div className="w-screen h-screen flex justify-center items-center bg-gray-200 fixed top-0 left-0">
        <div
          className={`bg-white w-96 ${
            errorMessage || successMessage ? "h-80" : "h-64"
          }  p-8 box-border overflow-hidden shadow-md rounded-md`}
        >
          <h2 className="text-center text-gray-700 font-medium text-lg  pb-3  mx-auto">
            Forgot Password
          </h2>

          {errorMessage && (
            <p className="text-white text-center py-1.5 bg-red-700 font-medium text-base">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="text-white text-center py-1.5 bg-green-700 font-medium text-base my-3">
              {successMessage}
            </p>
          )}

          <form
            className="flex flex-col items-center mt-6 space-y-6"
            onSubmit={forgotPasswordSubmit}
          >
            <div className="relative w-full">
              <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl" />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-200"
              />
            </div>

            <button
              type="submit"
              className="bg-[var(--button-bg-color)] w-full flex items-center gap-2 justify-center text-black py-2 px-4 rounded-md hover:bg-[var(--button-bg-color)] transition-all shadow-md cursor-pointer"
            >
              Send {loadingMain ? <Loading /> : ""}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ForgotPassword;
