import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService.ts";

export function useLogin() {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const login = async (data: any) => {
        setIsLoading(true)
        try{
            const response = await authService.login(data);
            localStorage.setItem("token", response.token);
            navigate("/feed");
        } catch (error) {
            console.error("Erro no login", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading };
}