import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth-service";

export function useLogin() {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const login = async (data: any) => {
        setIsLoading(true)
        try{
            const response = await authService.login(data);

            if (response.status === 200 || response.status < 300) {
                const token = response.data?.dados?.accessToken; 
            
                if (token) {
                    localStorage.setItem("token", token);
                    navigate("/feed");
                }
            }

        } catch (error) {
            console.error("Erro no login", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading };
}