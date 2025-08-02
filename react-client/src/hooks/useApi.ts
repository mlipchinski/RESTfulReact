import { ApiError } from "@/types";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
    execute: (...args: any[]) => Promise<T | undefined>;
    reset: () => void;
}

export const useApi = <T>(
    apiFunction: (...args: any[])=>Promise<T>
): UseApiReturn<T> => {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = useCallback(
        async (...args: any[]): Promise<T | undefined> => {
            setState({ data: null, loading: true, error: null });

            try {
                const result = await apiFunction(...args);
                setState({ data: result, loading: false, error: null });
                return result;
            } catch (err) {
                const axiosError = err as AxiosError<ApiError>;
                const errMessage = axiosError.response?.data?.error ||
                    axiosError.message || 'An unexpected error occurred';
                
                setState({ data: null, loading: false, error: errMessage });
                throw err;
            }
        },
        [apiFunction]
    );

    const reset = useCallback(() => {
        setState({ data: null, loading: false, error: null });

    }, []);

    return {
        ...state,
        execute,
        reset,
    }
}

export default useApi;