import React from "react";
import { useNavigate } from "react-router-dom";

interface ButtonBody {
  text: string;
  value: number;
  link: string;
}

const Button = ({ text, value, link }: ButtonBody) => {
  const navigate = useNavigate();
  return (
    <div>
      {" "}
      <button
        onClick={() => navigate(link)}
        style={{
          width: `${value}px`,
        }}
        className={`bg-[var(--button-bg-color)] font-medium  py-2 rounded-lg`}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
