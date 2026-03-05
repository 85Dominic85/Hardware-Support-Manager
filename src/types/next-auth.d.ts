import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "technician" | "viewer";
    } & DefaultSession["user"];
  }

  interface User {
    role: "admin" | "technician" | "viewer";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "technician" | "viewer";
  }
}
