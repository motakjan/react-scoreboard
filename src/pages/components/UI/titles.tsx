import React from "react";

type TitleProps = {
  text: string;
  size?: string;
};

export const Title: React.FC<TitleProps> = ({ text, size = "text-4xl" }) => {
  return <h1 className={`mb-2 font-bold ${size}`}>{text}</h1>;
};
