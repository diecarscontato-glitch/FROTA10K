import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      const protectedPaths = [
        "/dashboard",
        "/assets",
        "/leads",
        "/marketplace",
        "/negotiations",
        "/tasks",
        "/reports",
        "/settings",
        "/team",
        "/notifications",
        "/publications"
      ];
      
      const isProtectedRoute = protectedPaths.some(path => 
        nextUrl.pathname === path || nextUrl.pathname.startsWith(`${path}/`)
      );

      if (isProtectedRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.accountId = (user as any).accountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        const s = session as any;
        s.user.role = token.role as string;
        s.user.accountId = token.accountId as string;
      }
      return session;
    },
  },
  providers: [], // Add empty providers array here, will be populated in auth.ts
} satisfies NextAuthConfig;
