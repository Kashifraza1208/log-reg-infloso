import noDataImg from "../../assets/image 6.svg";

const NoDataFound = () => {
  return (
    <div className="w-full h-full flex justify-center items-center mb-10">
      <div>
        <img src={noDataImg} alt="noDataImg" />
        <div className="text-[#818181] text-center text-[40px] leading-[28px] font-semibold">
          No Data Found
        </div>
      </div>
    </div>
  );
};

export default NoDataFound;
