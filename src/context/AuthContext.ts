import { createContext, useContext } from "react";
import { CognitoUserWithAttributes } from "../services/authentication";

type AuthContextData = {
  user: CognitoUserWithAttributes | null;
  setUser?: (user: CognitoUserWithAttributes) => void;
  authStatus: "checking" | "authenticated" | "unauthenticated";
  logIn?: (user: CognitoUserWithAttributes) => void;
  logOut?: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextData>({
  user: null,
  authStatus: "checking",
});

export const useAuth = () => useContext(AuthContext);
