import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Point } from "geojson";
import { useAuth } from "@/auth/authProvider";

export type Lake = {
  id: number;
  name: string;
  area: number;
  depth: number;
  description: string;
  location: Point;
};

type LakesContextProps = {
  lakes: Lake[];
  isLoading: boolean;
  error: string | null;
};

// Create LakesContext
export const LakesContext = createContext<LakesContextProps | undefined>(
  undefined
);

// Custom hook to use LakesContext
export const useLakes = () => {
  return useContext(LakesContext);
};

// LakesProvider component
export const LakesProvider = ({ children }) => {
  const [lakes, setLakes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the isAuthenticated value from the useAuth hook
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchLakes = async () => {
      // Check if the user is authenticated before fetching lakes
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get("/lakes");
        setLakes(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchLakes();
  }, [isAuthenticated]); // Add isAuthenticated to the dependency array

  const values = {
    lakes,
    isLoading,
    error,
  };

  return (
    <LakesContext.Provider value={values}>{children}</LakesContext.Provider>
  );
};
