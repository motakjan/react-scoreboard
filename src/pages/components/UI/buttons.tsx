import React from "react";

type TLogoButton = {
  text: string;
  icon: JSX.Element;
  onClick?: () => void;
  className?: string;
};

export const LogoButton: React.FC<TLogoButton> = ({
  text,
  icon,
  onClick,
  className,
}) => (
  <button type="button" onClick={onClick} className={className}>
    {icon}
    {text}
  </button>
);
