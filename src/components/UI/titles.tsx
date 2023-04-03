import React from "react";

type TitleProps = {
  text: string;
  size?: string;
};

type TitleWithSubProps = {
  text: string;
  subtext: string;
};

export const Title: React.FC<TitleProps> = ({ text, size = "text-4xl" }) => {
  return <h1 className={`mb-2 font-bold ${size}`}>{text}</h1>;
};

export const TitleWithSub: React.FC<TitleWithSubProps> = ({
  text,
  subtext,
}) => {
  return (
    <>
      <h2 className="text-2xl">{text}</h2>
      <h2 className="mb-2 text-sm text-neutral-500">{subtext}</h2>
    </>
  );
};
