import { useState } from "react";
import { handleLogout } from "@/auth/logout";
import { Link, useLocation } from "react-router-dom";
import CreateCaughtFishModal from "../createCaughtFishModal";

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
      <img src="" alt="Logo" className="h-8" />
      <h1> logo placeholderis</h1>
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return <CreateCaughtFishModal />;
};

const Navbar = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Define the list of navigation items
  const navItemsLeft = [{ path: "/", label: "Home" }];

  const navItemsRight = [{ path: "/profile", label: "Profile" }];

  return (
    <div>
      <NavigationMenu className="h-16 bg-slate-100">
        <NavigationMenuList className="flex justify-between items-center h-full px-4">
          <div className="flex space-x-4">
            <Logo />
            {navItemsLeft.map((item) => (
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
            <button className="mx-4 font-semibold" onClick={handleOpenModal}>
              Man pakibo
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
                <button className="mx-4" onClick={handleLogout}>
                  Logout
                </button>
              </NavigationMenuItem>
            ))}
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
