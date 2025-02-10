// import { useEffect, useRef, useState } from "react";
// import { FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { logout } from "../../redux/user/userSlice";
// import { toast } from "react-toastify";
import { RiArrowDownSLine } from "react-icons/ri";
// import { CgProfile } from "react-icons/cg";
// import { IoMdSettings } from "react-icons/io";
import { User } from "../../types/userTypes";
import { AppDispatch } from "../../types/reduxTypes";

interface UserProfileBody {
  user: User | null;
  open: boolean;
}

const UserProfile = ({ user, open }: UserProfileBody) => {
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // const dropdownRef = useRef<HTMLDivElement | null>(null);

  // const handleDropdownToggle = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setIsDropdownOpen(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const name = user?.first_name + " " + user?.last_name;

  const firstLetterFirstWord = name?.split(" ")[0]?.charAt(0).toUpperCase();
  const firstLetterSecondWord = name?.split(" ")[1]?.charAt(0).toUpperCase();
  const profileColorData = user?.color;

  return (
    <div className=" text-white ">
      <div className="container mx-auto flex items-center justify-between py-4">
        {/* User Profile */}
        <div
          className="relative "
          // ref={dropdownRef}
        >
          <div
            className="flex items-center  text-[var(--secondary-color)] justify-center  cursor-pointer"
            // onClick={handleDropdownToggle}
          >
            <div
              style={{ backgroundColor: profileColorData }}
              className="w-10 h-10 flex  p-2 justify-center items-center text-lg  rounded-full  font-semibold"
            >
              {(firstLetterFirstWord ? firstLetterFirstWord : "") +
                (firstLetterSecondWord ? firstLetterSecondWord : "")}
            </div>
            <span
              className={`${
                !open ? "hidden" : "block"
              } text-lg ml-2 font-medium`}
            >
              {user?.first_name + " " + user?.last_name}
            </span>
            {/* <RiArrowDownSLine
              className={`text-2xl text-white ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            /> */}
          </div>

          {/* Dropdown */}
          {/* {isDropdownOpen && (
            <div className="absolute -right-4 mt-2 w-52  bg-[var(--primary-color)]  rounded-lg  z-50">
              <ul className="text-[var(--button-bg-color)]    font-semibold">
                <li
                  className="flex items-center border border-l-0 border-r-0 border-t-0 border-b-gray-500 hover:bg-[var(--primary-light-color)] px-4 py-3 cursor-pointer"
                  // onClick={handleLogout}
                >
                  <CgProfile className="mr-2 text-white text-lg" />
                  <span>Profile</span>
                </li>
                <li
                  className="flex items-center border border-l-0 border-r-0 border-t-0 border-b-gray-500 hover:bg-[var(--primary-light-color)] px-4 py-3 cursor-pointer"
                  // onClick={handleLogout}
                >
                  <IoMdSettings className="mr-2 text-lg text-white" />
                  <span>Settings</span>
                </li>{" "}
                <li
                  className="flex items-center  hover:bg-[var(--primary-light-color)] px-4 py-3 cursor-pointer"
                  onClick={handleLogout}
                >
                  <FiLogOut className="mr-2 text-white text-lg" />
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
