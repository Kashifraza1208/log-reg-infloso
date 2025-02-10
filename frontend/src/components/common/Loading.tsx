import loading from "../../assets/loading.gif";

const Loading = () => {
  return (
    <div className="flex justify-center items-center mx-4">
      <img className="w-[20px] h-[20px]" src={loading} alt="loading..." />
    </div>
  );
};

export default Loading;
