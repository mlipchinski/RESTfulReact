import type React from "react";
import { useEffect, useState } from "react";
import type { ApiError, LoginCredentials } from "@/types";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import './Auth.css';
import { authAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import useApi from "@/hooks/useApi"; //Hook import

const Login: React.FC = () => {
    const [formData, setFormData] = useState<LoginCredentials>({
        username: '',
        password: '',
    });

    //const [error, setError] = useState<string>('');
    //const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    //Use custom hook
    const {
        data: authResponse,
        loading,
        error: apiError,
        execute: executeLogin,
        reset: resetApiState,
    } = useApi(authAPI.login);

    //Handle success
    useEffect(() => {
        if (authResponse) {
            login(authResponse.token, authResponse.user);
            navigate('/home');
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        //Clear error when user starts typing
        if (apiError) resetApiState();
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        try {
            await executeLogin(formData);
            // Success handling is done in useEffect above
        } catch (err) {
            // Error handling is done by useApi hook
            console.error('Login failed:', err);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Login</h2>
                {apiError && <div className="error-message">{apiError}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading} 
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="auth-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;

