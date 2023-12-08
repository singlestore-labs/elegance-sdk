import { ClientConfig } from "../index";

export type Fetcher = ReturnType<typeof createFetcher>;

export function createFetcher({ baseURL, defaultRequestOptions }: ClientConfig) {
  return async <R = any>(...[path, requestOptions]: Parameters<typeof fetch>) => {
    const result = await fetch(`${baseURL}/elegance${path}`, {
      ...defaultRequestOptions,
      ...requestOptions,
      headers: {
        "Content-Type": "application/json",
        ...defaultRequestOptions?.headers,
        ...requestOptions?.headers
      }
    });

    const data = await result.json();

    if (!result.ok) {
      throw data;
    }

    return data as R;
  };
}
