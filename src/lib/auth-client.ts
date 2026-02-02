import { createAuthClient } from "better-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const authClient = createAuthClient({
  baseURL: API_URL,
});

export const {
  signIn,
  signUp,
  signOut,
  useSession: useSessionOriginal,
} = authClient;

// Extended session hook with role support
export function useSession() {
  const session = useSessionOriginal();

  // Type assertion to include role in user object
  return session as {
    data: {
      user: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
        emailVerified: boolean;
        role: "STUDENT" | "TUTOR" | "ADMIN";
        createdAt: Date;
        updatedAt: Date;
      };
      session: {
        id: string;
        expiresAt: Date;
        token: string;
        userId: string;
      };
    } | null;
    isPending: boolean;
    error: Error | null;
  };
}
