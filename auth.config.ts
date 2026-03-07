import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { env } from "@/env.mjs";

export default {
  providers: [
    // --- OEON 论坛一键登录 ---
    {
      id: "wordpress",
      name: "OEON 论坛登录",
      type: "oauth",
      authorization: "https://oeon.cc/oauth/authorize",
      token: "https://oeon.cc/oauth/token",
      userinfo: "https://oeon.cc/oauth/me", 
      clientId: "Rw4MSDStMY6Ug6OIjuLpxGaGWOnbBcW6EVJ8uuBL", 
      clientSecret: "3VWWz25lL2jaSkjl6W9Q2wRCNHSaowgk1lZbsj8R",
      checks: ["state"],
      profile: (profile: any) => {
        return {
          id: (profile.ID || profile.id || "").toString(),
          name: profile.display_name || profile.username || profile.name,
          email: profile.user_email || profile.email,
          image: profile.avatar_url || null,
        };
      },
    },
    // --- Google ---
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // --- Github ---
    Github({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    // --- Linux Do (已修复报错) ---
    {
      id: "linuxdo",
      name: "Linux Do",
      // version: "2.0", <-- 这一行已删掉，防止编译报错
      type: "oauth",
      authorization: "https://connect.linux.do/oauth2/authorize",
      token: "https://connect.linux.do/oauth2/token",
      userinfo: "https://connect.linux.do/api/user",
      clientId: env.LinuxDo_CLIENT_ID,
      clientSecret: env.LinuxDo_CLIENT_SECRET,
      checks: ["state"],
      profile: (profile: any) => {
        return {
          id: profile.id.toString(),
          name: profile.username,
          image: profile.avatar_url,
          email: profile.email,
          active: profile.active ? 1 : 0,
        };
      },
    },
    // --- Credentials ---
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
