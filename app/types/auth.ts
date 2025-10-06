export interface UseAuthReturn {
  login: () => Promise<void>;
  logout: () => void;
  handleCallback: () => Promise<void>;
  isAuthenticated: ComputedRef<boolean>;
  getAccessToken: () => string | null | undefined;
  user: ComputedRef<{
    name?: string;
    email?: string;
    username?: string;
    given_name?: string;
    family_name?: string;
    id?: string;
    issuedAt?: number;
    expiresAt?: number;
    issuer?: string;
    audience?: string[];
    type?: string;
    roles: string[];
  } | null>;
}
