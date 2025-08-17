import { createContext } from "react";
import { AuthContextType } from "../interface/loginInterface";


export const AuthContext = createContext<AuthContextType | undefined>(undefined);
