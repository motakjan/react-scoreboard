import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";

export default function Custom404() {
  const router = useRouter();
  return (
    <div className="bg-40 flex min-h-screen flex-col items-center justify-center bg-neutral-950 bg-404 text-white grayscale">
      <Image
        src="/images/logo.svg"
        alt="logo"
        width={100}
        height={30}
        loading="lazy"
      />
      <h1 className=" text-9xl font-bold italic">
        4<span className=" text-red-600">0</span>4
      </h1>
      <p className="py-6 text-lg">
        Sorry the page you are looking for does not exist.
      </p>
      <button
        className="flex items-center gap-1 rounded-full bg-red-700 px-4 py-2 font-semibold"
        onClick={() => router.push("/")}
      >
        Go to main page
        <IoIosArrowForward size={18} className="mt-[2px]" />
      </button>
    </div>
  );
}
