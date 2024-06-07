import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Point } from "geojson";

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

  useEffect(() => {
    const fetchLakes = async () => {
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
  }, []);

  const values = {
    lakes,
    isLoading,
    error,
  };

  return (
    <LakesContext.Provider value={values}>{children}</LakesContext.Provider>
  );
};
