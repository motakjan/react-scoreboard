import { useState } from "react";

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
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-neutral-900 p-6 text-white shadow-sm">
        {children}
        <button
          className="mt-4 w-full rounded bg-blue-500 px-4 py-2 text-center font-bold text-white hover:bg-blue-600"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;
