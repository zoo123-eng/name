import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { env } from "@/env.mjs"; 

export default {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    {
      id: "linuxdo", // 绝对不动这个 ID
      name: "OEON 论坛",
      type: "oauth",
      authorization: "https://oeon.cc/oauth/authorize",
      token: "https://oeon.cc/oauth/token",
      userinfo: "https://oeon.cc/wp-json/wp-oauth/me",
      clientId: env.LinuxDo_CLIENT_ID,
      clientSecret: env.LinuxDo_CLIENT_SECRET,
      checks: ["none"], 
      profile: (profile: any) => {
        const user = profile.user || profile.data || profile;
        return {
          id: (user.ID || user.id || "").toString(),
          name: user.display_name || user.user_login || "User",
          email: user.user_email || user.email || `${user.id}@oeon.cc`,
          image: user.avatar_url || null,
          role: "USER",
          active: 1,
        };
      },
    },
    Credentials({
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(
          (process.env.AUTH_URL || "") + "/api/auth/credentials",
          {
            method: "POST",
            body: JSON.stringify(credentials),
          },
        );
        if (res.ok) {
          return res.json();
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
