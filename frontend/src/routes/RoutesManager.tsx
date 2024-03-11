import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Navbar from "@/components/navbar/Navbar";
import { useAuth } from "@/auth/authProvider";
import About from "@/pages/About";
import Profile from "@/pages/Profile";

const RoutesManager = () => {
  const { isAuthenticated } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/service",
      element: <div>Service Page</div>,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/",
          element: (
            <>
              <Navbar />
              <Home />
            </>
          ),
        },
        {
          path: "/profile",
          element: (
            <>
              <Navbar />
              <Profile />
            </>
          ),
        },
        {
          path: "/about",
          element: (
            <>
              <Navbar />
              <About />
            </>
          ),
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!isAuthenticated ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default RoutesManager;
