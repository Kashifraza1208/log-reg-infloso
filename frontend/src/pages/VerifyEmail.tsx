import { useEffect, useState, Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import success from "../assets/success.png";

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState<boolean | null>(null);
  const [verificationCompleted, setVerificationCompleted] =
    useState<boolean>(false);
  const { token } = useParams();
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  // Verify email URL API call
  const verifyEmailUrl = async () => {
    try {
      const url = `${baseUrl}/api/v1/verify/email/${token}`;
      const { data } = await axios.get(url);

      setValidUrl(true);
      setVerificationCompleted(true);
    } catch (error) {
      console.log(error);
      setValidUrl(false);
    }
  };

  useEffect(() => {
    if (token) {
      verifyEmailUrl();
    }
  }, [token]);

  if (verificationCompleted) {
    return (
      <div className="flex items-center justify-center mt-36">
        <div className="flex flex-col items-center justify-center">
          <img src={success} alt="success_img" className="w-24 h-24 mb-6" />
          <h1 className="text-xl font-semibold mb-4">
            Email verified successfully. You can log in now.
          </h1>
          <Link to="/login">
            <button className="bg-teal-500 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-teal-600 focus:outline-none">
              Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      {validUrl === null ? (
        <div className="flex items-center justify-center mt-36">
          <h1 className="text-xl font-semibold">Verifying...</h1>
        </div>
      ) : validUrl ? (
        <div className="flex items-center justify-center mt-36">
          <div className="flex flex-col items-center justify-center">
            <img src={success} alt="success_img" className="w-24 h-24 mb-6" />
            <h1 className="text-xl font-semibold mb-4">
              Email verified successfully
            </h1>
            <Link to="/login">
              <button className="bg-teal-500 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-teal-600 focus:outline-none">
                Login
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <p>Not found</p>
      )}
    </Fragment>
  );
};

export default EmailVerify;
