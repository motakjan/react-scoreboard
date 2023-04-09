import React from "react";

type TitleWithSubProps = {
  text: string;
  subtext: string;
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
