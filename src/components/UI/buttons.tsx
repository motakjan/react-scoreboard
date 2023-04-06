import React from "react";
import { VscLock } from "react-icons/vsc";
import { LoadingSpinner } from "./loading";

type LogoButtonProps = {
  text: string;
  icon?: JSX.Element;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
};

type IconButtonProps = {
  icon: JSX.Element;
  onClick: () => void;
  className?: string;
};

export const LogoButton: React.FC<LogoButtonProps> = ({
  text,
  icon,
  onClick,
  className,
  loading,
  disabled,
  type,
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
      type={type ? type : "button"}
      onClick={onClick}
      className={generateClassName()}
      disabled={disabled || loading}
    >
      {renderIcon()}
      {text}
    </button>
  );
};

export const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${
        className || ""
      }  inline-flex items-center rounded-lg text-center text-sm text-white`}
    >
      {icon}
      <span className="sr-only">Icon description</span>
    </button>
  );
};
