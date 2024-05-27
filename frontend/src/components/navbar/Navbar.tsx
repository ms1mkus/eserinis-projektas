import { useContext, useState } from "react";
import { handleLogout } from "@/auth/logout";
import { Link, useLocation } from "react-router-dom";
import CreateCaughtFishModal from "../createCaughtFishModal";
import { useDarkMode } from "@/context/DarkModeContext";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { LakesContext } from "@/context/LakesContext";

// Define NavigationMenu component
const NavigationMenu = ({ children, className }) => {
  return <div className={`NavigationMenu ${className}`}>{children}</div>;
};

// Define NavigationMenuList component
const NavigationMenuList = ({ children, className }) => {
  return <div className={`NavigationMenuList ${className}`}>{children}</div>;
};

// Define NavigationMenuItem component
const NavigationMenuItem = ({ children, className }) => {
  return <div className={`NavigationMenuItem ${className}`}>{children}</div>;
};

const Logo = () => {
  return (
    <div className="flex items-center">
      <img src="../../../public/logo.png" width={150} />
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { darkMode, setDarkMode } = useDarkMode();

  const lakeContext = useContext(LakesContext);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const Modal = ({ isOpen }) => {
    if (!isOpen) return null;

    return <CreateCaughtFishModal handleCloseModal={handleCloseModal} />;
  };

  // Define the list of navigation items
  const navItemsLeft = [{ path: "/", label: "Pradžia" }];

  const navItemsRight = [{ path: "/about", label: "Apie" }];

  return (
    <div>
      <NavigationMenu className="h-16 bg-slate-100">
        <NavigationMenuList className="flex justify-between items-center h-full px-4">
          <div className="flex space-x-4 align-items">
            <Logo />
            {navItemsLeft.map((item) => (
              <NavigationMenuItem className={"my-auto"} key={item.path}>
                <Link
                  to={item.path}
                  className={`px-2 text-gray-600 hover:text-gray-900 focus:outline-none ${
                    location.pathname === item.path
                      ? "font-bold"
                      : "font-normal"
                  }`}
                >
                  {item.label}
                </Link>
              </NavigationMenuItem>
            ))}
            <button
              className={`px-2 text-black-800 font-bold hover:text-blue-500 focus:outline-none`}
              onClick={handleToggleDarkMode} // Call handleToggleDarkMode to toggle dark mode
            >
              {darkMode ? "Patamsinti žemėlapį" : "Pašviesinti žemėlapį"}
            </button>

            <button
              className={`px-2 text-red-800 font-bold hover:text-blue-500 focus:outline-none flex flex-row justify-between items-center`}
              onClick={() => {
                lakeContext.setLovedOnly(!lakeContext.lovedOnly);
              }}
            >
              <HeartFilledIcon /> Tik mėgstami ežerai
            </button>
            <button
              className={`px-2 text-blue-800 font-bold hover:text-blue-500 focus:outline-none`}
              onClick={handleOpenModal}
            >
              Man pakibo!
            </button>
          </div>
          <div className="flex space-x-4 ml-auto">
            {navItemsRight.map((item) => (
              <NavigationMenuItem className={""} key={item.path}>
                <Link
                  to={item.path}
                  className={`py-4 px-2 text-gray-600 hover:text-gray-900 focus:outline-none ${
                    location.pathname === item.path
                      ? "font-bold"
                      : "font-normal"
                  }`}
                >
                  {item.label}
                </Link>
              </NavigationMenuItem>
            ))}
            <button
              className="mx-4 font-bold text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={handleLogout}
            >
              Atsijungti
            </button>
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>Modal Content Here</h2>
        <p>This is the content of the modal.</p>
      </Modal>
    </div>
  );
};

export default Navbar;
