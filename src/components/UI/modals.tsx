import { useState } from "react";
import { VscClose } from "react-icons/vsc";
import { IconButton } from "./buttons";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function Modal({ isOpen, onClose, children }: ModalProps) {
  const [opacity, setOpacity] = useState(isOpen ? "opacity-100" : "opacity-0");
  const [pointerEvents, setPointerEvents] = useState(
    isOpen ? "pointer-events-auto" : "pointer-events-none"
  );

  const handleClose = () => {
    setOpacity("opacity-0");
    setPointerEvents("pointer-events-none");
    setTimeout(onClose, 300); // adjust the timing to match your CSS transition
  };

  return (
    <div
      className={`fixed inset-0 bg-neutral-950 bg-opacity-50 backdrop-blur-[2px] transition-opacity ${opacity} ${pointerEvents}`}
    >
      <div className="fixed left-1/2 top-1/2 flex w-4/5 -translate-x-1/2 -translate-y-1/2 transform flex-col rounded-md bg-neutral-900 p-6 text-white shadow-sm sm:w-96">
        <IconButton
          icon={<VscClose size={20} />}
          onClick={handleClose}
          className="ml-auto"
        />
        {children}
      </div>
    </div>
  );
}

export default Modal;
