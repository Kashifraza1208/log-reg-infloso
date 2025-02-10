import { MdEmail } from "react-icons/md";
import { User } from "../../types/userTypes";
import { FaGoogleDrive } from "react-icons/fa6";
import axios from "axios";

interface ProfileSectionBody {
  isEditable: boolean;
  toggleEdit: () => void;
  user: User | null;
  setIsChangePasswordModal: (val: boolean) => void;
  selectedProjectDetails: any;
}

const ProfileSection = ({
  isEditable,
  toggleEdit,
  user,
  setIsChangePasswordModal,
  selectedProjectDetails,
}: ProfileSectionBody) => {
  const name = user?.first_name + " " + user?.last_name;
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  const firstLetterFirstWord = name?.split(" ")[0]?.charAt(0).toUpperCase();
  const firstLetterSecondWord = name?.split(" ")[1]?.charAt(0).toUpperCase();

  const handleDriveUpload = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/documents/google/drive/auth`
      );
      console.log(response);
      if (response.data.success) {
        window.location.href = response.data.data.authUrl;
      }
    } catch (error) {
      console.error("OAuth Error:", error);
    }
  };

  return (
    <div className="w-full bg-[#f3f3f94a] h-[116px] flex justify-between items-center shadow-md px-6 py-4">
      {/* Profile Image and Name */}
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 flex bg-purple-500 p-2 justify-center items-center text-lg  rounded-full text-white font-semibold">
          {(firstLetterFirstWord ? firstLetterFirstWord : "") +
            (firstLetterSecondWord ? firstLetterSecondWord : "")}
        </div>

        <div className="flex flex-col">
          <div className="text-2xl leading-[24px] text-[#424242] font-semibold">
            {name}
          </div>

          <div className="flex gap-2 text-base leading-[24px] items-center text-[#424242]">
            <MdEmail />
            {user?.email}
          </div>
        </div>
      </div>

      {/* Last Logged In and Last Created At */}

      {/* Action Buttons */}

      <div className="flex gap-4">
        <button
          onClick={handleDriveUpload}
          className="bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05] flex items-center text-white py-2 px-4 rounded-md hover:opacity-90 transition"
        >
          <FaGoogleDrive className="mr-2 text-white text-xl" /> Connect Google
          Drive
        </button>

        <button
          onClick={() => setIsChangePasswordModal(true)}
          className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition`}
        >
          Change Password
        </button>
        <button
          onClick={toggleEdit}
          className={`${
            isEditable ? "bg-gray-500" : "bg-blue-500"
          } text-white py-2 px-4 rounded-md hover:opacity-90 transition`}
        >
          {isEditable ? "Cancel" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;
