import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// import { loginWithBackend } from "@/features/auth/api/login.api";
import { loginUser } from "@/features/auth/api/auth.api";

const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

type JwtPayload = {
  userId?: string;
  role?: "ADMIN";
  iat?: number;
  exp?: number;
};

function decodeJwtPayload(token: string): JwtPayload {
  try {
    const part = token.split(".")[1];

    if (!part) {
      return {};
    }

    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");

    const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "=");

    const json = atob(padded);

    return JSON.parse(json) as JwtPayload;
  } catch {
    return {};
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
  },

  jwt: {
    maxAge: SESSION_MAX_AGE_SECONDS,
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        // const { access_token } = await loginWithBackend(email, password);
        const { access_token } = await loginUser({ email, password });

        // Decode backend JWT
        const payload = decodeJwtPayload(access_token);

        // Your backend JWT contains `userId`, not `sub`
        const id = payload.userId;

        if (!id) {
          throw new Error("Invalid token from server");
        }

        return {
          id,
          email,
          accessToken: access_token,
          role: payload.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // This runs after successful login
      if (user) {
        if ("accessToken" in user && typeof user.accessToken === "string") {
          token.accessToken = user.accessToken;
        }

        if (user.id) {
          token.sub = user.id;
        }

        if (user.email) {
          token.email = user.email;
        }

        if ("role" in user && user.role === "ADMIN") {
          token.role = user.role;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Add backend access token to session
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }

      // Add user information
      if (token.sub) {
        session.user = {
          ...session.user,
          id: token.sub,
        };
      }

      if (token.email) {
        session.user.email = token.email;
      }

      if (token.name) {
        session.user.name = token.name;
      }

      // Add role
      if (token.role === "ADMIN") {
        session.user.role = token.role;
      }

      return session;
    },
  },
};
