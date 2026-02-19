"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaAddressCard, FaTruck } from "react-icons/fa";
import { FaHandHoldingDollar, FaListCheck } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { RiCustomerServiceFill } from "react-icons/ri";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../../../public/images/logo5.svg";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";
// import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { LogoutUser } from "@/lib/actions";
import { useUserStore } from "@/lib/utils/store";

type UserNames = {
  firstName: string;
  lastName: string;
  email: string;
};

const UserAsideNav: React.FC<UserNames> = ({ firstName, lastName, email }) => {
  const pathname = usePathname(); // Replaces router.pathname
  const [isCollapsed, setIsCollapsed] = useState(false); // Track toggle state
  const [settingsOpen, setSettingsOpen] = useState(false); // Track submenu toggle

  const { user, destroyUserInfo } = useUserStore();

  useEffect(() => {
    // toast.success(`welcome ${user?.firstName}`);
    useUserStore.persist.rehydrate();
  }, []);

  // const username = decrypt(cookies.toString());
  // console.log(username);

  // Toggle the sidebar collapse
  // const toggleSidebar = () => {
  //     setIsCollapsed(!isCollapsed);
  // };

  // Toggle sidebar collapse
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const router = useRouter();

  // Toggle settings submenu
  const toggleSettingsMenu = () => setSettingsOpen(!settingsOpen);

  return (
    <aside
      className={`relative h-full md:h-screen items-center justify-start bg-gray-800 text-white flex flex-col p-2 md:p-4 transition-all duration-300 ${
        isCollapsed ? "w-12" : " w-[266px] md:w-64"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-2 md:top-4 right-2 md:right-2 bg-gray-600 p-2 rounded-md text-white"
      >
        {isCollapsed ? <FaArrowAltCircleRight /> : <FaArrowAltCircleLeft />}
      </button>

      <div className=" font-semibold mb-6 border-b-2 border-white mt-6 md:mt-0">
        <div className="sm:flex justify-start flex-row py-3 pr-3 pl-2">
          <div className="flex items-center justify-start flex-row">
            <Image
              className="w-5 md:w-10 h-5 md:h-10"
              src={user.image}
              alt="individual person"
              width={`${isCollapsed ? 40 : 150}`}
              height={isCollapsed ? 40 : 150}
            />
            {/* Show name and email only when expanded */}
            {!isCollapsed && (
              <div className="ml-2 pr-2 md:pr-0">
                <p className="text-[10px] md:text-sm leading-4 font-semibold text-white">
                  {user.firstName + " " + user.lastName}
                </p>
                <p className="font-normal text-[8px] md:text-xs leading-3 text-white ">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="flex flex-col space-y-0 md:space-y-2">
        <Link
          href="/pages/userdashboard"
          className={`userdashboardasidestyle font-semibold  ${
            pathname === "/pages/userdashboard"
              ? "bg-gray-700"
              : "hover:bg-gray-700"
          }`}
        >
          <span className="md:text-xl text-sm">
            <MdDashboard />
          </span>
          {!isCollapsed && (
            <p className="userdashboardasidestyleText">OVERVIEW</p>
          )}
        </Link>
        <Link
          href="/pages/userdashboard/trackinglist"
          className={`userdashboardasidestyle ${
            pathname === "/pages/userdashboard/trackinglist"
              ? "bg-gray-700"
              : "hover:bg-gray-700"
          }`}
        >
          <span className="md:text-xl text-sm">
            <FaTruck />
          </span>
          {!isCollapsed && (
            <p className="userdashboardasidestyleText">Tracking List</p>
          )}
        </Link>
        <Link
          href="/pages/userdashboard/orderlist"
          className={`userdashboardasidestyle ${
            pathname === "/pages/userdashboard/orderlist"
              ? "bg-gray-700"
              : "hover:bg-gray-700"
          }`}
        >
          <span className="md:text-xl text-sm ">
            <FaListCheck />
          </span>
          {!isCollapsed && (
            <p className="userdashboardasidestyleText">Orders</p>
          )}
        </Link>
        <Link
          href="/pages/userdashboard/useraddress"
          className={`userdashboardasidestyle ${
            pathname === "/pages/userdashboard/useraddress"
              ? "bg-gray-700"
              : "hover:bg-gray-700"
          }`}
        >
          <span className="md:text-xl text-sm">
            <FaAddressCard />
          </span>
          {!isCollapsed && (
            <p className="userdashboardasidestyleText">Address</p>
          )}
        </Link>
        <Link
          href="/pages/userdashboard/userpayment"
          className={`userdashboardasidestyle ${
            pathname === "/pages/userdashboard/userpayment"
              ? "bg-gray-700"
              : "hover:bg-gray-700"
          }`}
        >
          <span className="md:text-xl text-sm">
            <FaHandHoldingDollar />
          </span>
          {!isCollapsed && (
            <p className="userdashboardasidestyleText">Payment Method</p>
          )}
        </Link>
      </nav>

      {/* <div className="absolute flex flex-col w-full bottom-16 md:bottom-24 items-start justify-start md:items-start md:justify-center pl-0 md:pl-5 md:pr-5"> */}
      <div className="absolute flex flex-col space-y-0 md:space-y-2 bottom-16 md:bottom-24">
        <Link
          href="/pages/userdashboard/usercustomercare"
          className={`userdashboardasidestyle2 ${
            pathname === "/pages/userdashboard/usercustomercare"
              ? "bg-gray-700"
              : "hover:bg-gray-700"
          }`}
        >
          <span className="md:text-xl text-sm">
            <RiCustomerServiceFill />
          </span>
          {!isCollapsed && (
            <p className="userdashboardasidestyleText2">Customer Care</p>
          )}
        </Link>

        {/* <Link
                    href="/pages/userdashboard/usersettings"
                    className={`userdashboardasidestyle2 ${pathname === "/pages/userdashboard/usersettings"
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                        }`}
                >
                    <span className="md:text-xl text-sm">
                        <IoMdSettings />
                    </span>
                    {!isCollapsed && <p className="userdashboardasidestyleText2">Settings</p>}
                </Link> */}

        <div>
          <button
            onClick={toggleSettingsMenu}
            className={`w-full flex items-center justify-start gap-2 p-2 rounded-md ${
              pathname.includes("/pages/userdashboard/usersettings")
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            <IoMdSettings className="text-xl" />
            {!isCollapsed && <span>Settings</span>}
            {!isCollapsed && (
              <span className="ml-auto">{settingsOpen ? "▲" : "▼"}</span>
            )}
          </button>

          {settingsOpen && (
            <div className="flex flex-col pl-6 space-y-1 mt-1">
              <Link
                href="/pages/userdashboard/usersettings/profile"
                className={`p-2 rounded-md ${
                  pathname === "/pages/userdashboard/usersettings/profile"
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                Profile Settings
              </Link>
              <Link
                href="/pages/userdashboard/usersettings/password"
                className={`p-2 rounded-md ${
                  pathname === "/pages/userdashboard/usersettings/password"
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                Password
              </Link>
              <Link
                href="/pages/userdashboard/usersettings/notifications"
                className={`p-2 rounded-md ${
                  pathname === "/pages/userdashboard/usersettings/notifications"
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                Notifications
              </Link>
              <Link
                href="/pages/userdashboard/usersettings/deleteaccount"
                className={`p-2 rounded-md ${
                  pathname === "/pages/userdashboard/usersettings/deleteaccount"
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                }`}
              >
                Delete Account
              </Link>
            </div>
          )}
        </div>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            LogoutUser();
            destroyUserInfo(user)
            router.push("/login");
          }}
          className={`userdashboardasidestyle2 ${
            pathname === "/pages/userdashboard/logout"
              ? "bg-red-700"
              : "hover:bg-red-800"
          }`}
        >
          <span className="md:text-xl text-sm">
            <IoMdSettings />
          </span>
          {!isCollapsed && (
            <p className="userdashboardasidestyleText2">LOGOUT</p>
          )}
        </Link>
      </div>

      <div className="absolute flex items-center justify-center w-full bottom-[-10px] left-0 pb-2 border-t-2 border-white pt-2">
        <Image
          src={user.image}
          alt="Description of the image"
          width={`${isCollapsed ? 40 : 60}`}
          height={isCollapsed ? 40 : 80}
          className="w-24 md:w-48"
        />
      </div>
    </aside>
  );
};

export default UserAsideNav;
