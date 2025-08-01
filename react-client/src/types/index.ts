//User interface type
export interface User {
    id: number;
    username: string;
    createdAt: string;
}

//Auth types
export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData{
    username: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

//Api Response types
export interface ApiError {
    error: string;
    authenticated?: boolean;
}

export interface RootResponse {
    message: string;
    authenticated: boolean;
    redirect: string;
    user?: User;
}

export interface HomeResponse {
    message: string;
    page: string;
    user: User;
    timestamp: string;
}

export interface LoginPageResponse {
    message: string;
    page: string;
    instructions: {
        register: string;
        login: string;
    };
}

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

export interface ProtectedRouteProps {
    children: React.ReactNode;
}

export interface AuthProviderProps {
    children: React.ReactNode;
}

