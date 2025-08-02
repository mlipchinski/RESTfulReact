import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { AuthResponse, type ApiError, type RegisterData } from "@/types";
import { authAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import useApi from "@/hooks/useApi";
import '../Auth.css'

interface RegisterFormData extends RegisterData {
    confirmPassword: string;
}

const Register: React.FC = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        username: '',
        password: '',
        confirmPassword: '',
    });

    const [validationError, setValidationError] = useState<string>('');
    // const [loading, setLoading] = useState(false);
    

    const navigate = useNavigate();
    const { login } = useAuth();

    //Use custom hook
    //const { execute, loading, error } = useApi(authAPI.register);
    const {
        data: authResponse,
        loading,
        error: apiError,
        execute: executeRegister,
        reset: resetApiState,
    } = useApi<AuthResponse>(authAPI.register);

    //Handle successfull registraction
    useEffect(() => {
        if (authResponse) {
            login(authResponse.token, authResponse.user);
            navigate('/home');
        }
    }, [authResponse, login, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })

        // Clear errors when user starts typing
        if (validationError) setValidationError('');
        if (apiError) resetApiState();
    };

    const validateForm = (): boolean => {
        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            setValidationError('Passwords do not match');
            return false;
        }

        if (formData.password.length < 6) {
            setValidationError('Password must be at least 6 characters long');
            return false;
        }

        if (!formData.username.trim()) {
            setValidationError('Username is required');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        //setLoading(true);
        setValidationError('');

        if (!validateForm) {
            return;
        }            

        try {
            const registerData: RegisterData = {
                username: formData.username,
                password: formData.confirmPassword,
            }

            //const response = await authAPI.register(registerData);
            await executeRegister(registerData);

            //This will e called by useEffect
            //ogin(response.token, response.user);
            //navigate('/home');
        } catch (err) {
            // Error handling is done by useApi hook
        } 
    };

    // Determine which error to show
    const displayError = validationError || apiError;

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Create Account</h2>
                {displayError && <div className="error-message">{displayError}</div>}

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
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="Confirm your password"
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p className="auth-link">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );


}

export default Register;