import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SuccessToken = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("token")) {
      navigate("/overview");
    }
  }, [searchParams]);

  return <div>successToken</div>;
};

export default SuccessToken;
