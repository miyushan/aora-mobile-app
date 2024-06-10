import { getCurrentUser } from "@/lib/appwrite";
import { UserType } from "@/lib/types";
import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => {},
  user: undefined as UserType | undefined,
  setUser: (value: UserType | undefined) => {},
  isLoading: true,
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res as UserType);
        } else {
          setIsLoggedIn(false);
          setUser(undefined);
        }
      })
      .catch((error) => {
        console.log(error);
        throw new Error("Failed to get current user");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export default GlobalProvider;
