import React from "react";
import type { Request, DefaultError } from "../../shared/types";

export type UseRequestOptions<T = any> = {
  initialValue?: T;
  initialIsLoading?: boolean;
  onError?: (error: DefaultError) => void;
};

export function useRequest<T extends Request = Request, O extends UseRequestOptions = UseRequestOptions>(
  request: T,
  options?: O
) {
  type V = Awaited<ReturnType<T>>;

  const requestRef = React.useRef(request);
  const optionsRef = React.useRef<UseRequestOptions>({ initialValue: undefined, initialIsLoading: false, ...options });

  const [value, setValue] = React.useState<V | undefined>(optionsRef.current.initialValue);
  const [error, setError] = React.useState<DefaultError | undefined>();
  const [isLoading, setIsLoading] = React.useState(optionsRef.current.initialIsLoading ?? false);

  const execute = React.useCallback(async (...args: Parameters<T>): Promise<V | undefined> => {
    try {
      setIsLoading(true);
      const result = await requestRef.current(...args);
      setError(undefined);
      setValue(result);
      setIsLoading(false);
      return result;
    } catch (error: any) {
      setError(error);
      setIsLoading(false);

      if (optionsRef.current.onError) {
        optionsRef.current.onError(error);
      } else {
        throw error;
      }
    }
  }, []);

  return { value, error, isLoading, setValue, setError, setIsLoading, execute };
}
