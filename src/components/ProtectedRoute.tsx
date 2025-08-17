import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { JSX } from "react";

export default function ProtectedRoute({ children }: {children: JSX.Element}){
    const {usuario } = useAuth();

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }
    return children;
}