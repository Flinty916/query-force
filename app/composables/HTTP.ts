import type { Headers } from "~/types/http";
import type { UseAuthReturn } from "~/types/auth";
import type { CommonHttp } from "~/types/http";
import { useLazyFetch, useFetch, type UseFetchOptions } from "nuxt/app";
import type { RuntimeConfig } from "nuxt/schema";

class HTTP {
  headers?: Partial<Headers>;
  config: RuntimeConfig;
  bearer: string | null;

  constructor(bearer: string | null, headers?: CommonHttp["headers"]) {
    this.headers = headers;
    this.bearer = bearer;
    this.config = useRuntimeConfig();
  }

  private buildHeaders(options: CommonHttp): Headers {
    const headers = {} as Headers;

    if (this.bearer) {
      headers["Authorization"] = `Bearer ${this.bearer}`;
    }

    if (options.body != null && typeof options.body === "object") {
      if (options.body instanceof FormData) {
        // Do not set Content-Type, let the browser set it (with boundary)
      } else {
        headers["Content-Type"] = "application/json";
      }
    }

    headers["Accept"] = "application/json";

    return headers;
  }

  private resend<T>(self: HTTP, url: string, options: CommonHttp) {
    return self.request<T>(url, options || { method: "get", headers: {} });
  }

  request<T>(url: string, options: CommonHttp) {
    const headers = this.buildHeaders(options);

    const fetchOptions: UseFetchOptions<T> = {
      method: options.method as CommonHttp["method"],
      headers: { ...headers, ...options.headers } as HeadersInit,
      body: options.body,
    };

    let fullUrl = url;
    const config = this.config;

    const fetchFn = options.lazy ? useLazyFetch : useFetch;
    return fetchFn<T>(fullUrl, fetchOptions as any);
  }

  private createMethod<T>(
    method: CommonHttp["method"],
    url: string,
    options?: Omit<CommonHttp, "method" | "body">
  ) {
    const parsedOptions = { ...options, method } as CommonHttp;
    const response = this.request<T>(url, parsedOptions);
    return {
      ...response,
      resend: (newUrl: string) => {
        const newResponse = this.resend<T>(this, newUrl, parsedOptions);
        newResponse.then((res: any) => {
          response.data.value = res.data.value;
        });
        return newResponse;
      },
    };
  }

  get<T>(url: string, options?: Omit<CommonHttp, "method" | "body">) {
    return this.createMethod<T>("get", url, options);
  }

  delete<T>(url: string, options?: Omit<CommonHttp, "method" | "body">) {
    return this.createMethod<T>("delete", url, options);
  }

  post<T>(url: string, options?: Omit<CommonHttp, "method">) {
    return this.createMethod<T>("post", url, options);
  }

  put<T>(url: string, options?: Omit<CommonHttp, "method">) {
    return this.createMethod<T>("put", url, options);
  }
}

export default HTTP;
