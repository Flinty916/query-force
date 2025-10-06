import type { UseAuthReturn } from "./auth";

export interface Headers {
  Authorization?: string | undefined;
  Accept?: string | undefined;
  "Content-Type"?: string | undefined;
}

export type GenerateHeadersCoreType = (
  useAuth: () => UseAuthReturn
) => (body?: any) => Headers;

export interface CommonHttp {
  method: "get" | "post" | "put" | "delete";
  headers?: Partial<Headers>;
  body?: any;
  lazy?: boolean;
}
