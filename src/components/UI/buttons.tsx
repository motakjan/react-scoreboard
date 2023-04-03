import React from "react";
import { VscLock } from "react-icons/vsc";
import { LoadingSpinner } from "./loading";

type TLogoButton = {
  text: string;
  icon?: JSX.Element;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
};

export const LogoButton: React.FC<TLogoButton> = ({
  text,
  icon,
  onClick,
  className,
  loading,
  disabled,
}) => {
  const generateClassName = () => {
    if (loading || disabled) {
      return `${className || ""} cursor-not-allowed`;
    }

    return className || "";
  };

  const renderIcon = () => {
    if (loading) return <LoadingSpinner />;
    if (disabled) return <VscLock />;

    return icon;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={generateClassName()}
      disabled={disabled || loading}
    >
      {renderIcon()}
      {text}
    </button>
  );
};
