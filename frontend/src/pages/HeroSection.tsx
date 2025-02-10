import { useEffect } from "react";
import MetaData from "../components/common/MetaData";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../types/reduxTypes";
import { logout } from "../redux/userSlice";

const UserProfile = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await dispatch(logout());
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black relative">
      {/* Grid Overlay */}
      <MetaData title="User Profile" />
      <div className="absolute inset-0 grid grid-cols-12 gap-1 opacity-10">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="border border-gray-700" />
        ))}
      </div>

      <div className="text-center relative z-10 bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white"
            style={{ backgroundColor: user.color }}
          >
            {user.name.charAt(0)}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">{user.name}</h1>
          <p className="mt-2 text-gray-400">{user.email}</p>
          <p className="mt-2 text-gray-400">@{user.username}</p>

          <div className="mt-6 text-left w-full">
            <p className="text-gray-400">
              <span className="font-semibold text-white">Last Login:</span>{" "}
              {new Date(user.last_login_at).toLocaleString()}
            </p>
            <p className="text-gray-400">
              <span className="font-semibold text-white">Account Created:</span>{" "}
              {new Date(user.created_at).toLocaleString()}
            </p>
            <p className="text-gray-400">
              <span className="font-semibold text-white">Status:</span>{" "}
              {user.is_verified ? "Verified" : "Not Verified"}
            </p>
          </div>

          <button
            className="mt-8 border text-base border-[var(--button-bg-color)] text-[var(--button-bg-color)] px-6 py-3 bg-[var(--primary-color)] rounded-lg transition duration-300"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
