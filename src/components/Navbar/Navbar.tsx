import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { VscSignIn } from "react-icons/vsc";
import { LogoButton } from "../UI/buttons";
import { ProfileSkeleton } from "../UI/skeletons";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { slug } = router.query;

  const links = [
    { label: "League", href: `/league/${slug as string}` },
    { label: "Players", href: `/players/${slug as string}` },
    { label: "Tournaments", href: `/tournaments/${slug as string}` },
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-neutral-950 shadow-lg">
      <div className=" w-full px-8 sm:px-16">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/logo.svg"
                alt="logo"
                width={100}
                height={30}
                loading="lazy"
              />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {links.map((link) => (
                <Link
                  href={link.href}
                  key={`pc_${link.href}`}
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-blue-700/20 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              {!isLoaded && <ProfileSkeleton />}
              {isSignedIn ? (
                <span className="flex items-center gap-2 font-medium text-white">
                  <UserButton />
                </span>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <LogoButton
                      text="Sign In"
                      icon={<VscSignIn size={20} />}
                      className="mr-2 inline-flex items-center gap-2 text-center text-sm font-medium text-white focus:outline-none"
                    />
                  </SignInButton>
                </>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={handleToggle}
              className="inline-flex items-center justify-center rounded-md bg-neutral-900 p-2 text-gray-400 hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>
      <div className={isOpen ? "block" : "hidden md:hidden"}>
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          {links.map((link) => (
            <Link
              href={link.href}
              key={`mobile_${link.href}`}
              className="block rounded-md px-16 py-2 text-base font-medium text-gray-300 hover:bg-neutral-800 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
