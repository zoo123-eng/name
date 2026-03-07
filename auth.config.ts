import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { env } from "@/env.mjs";

export default {
  providers: [
    // --- OEON 论坛一键登录 (修复 Server Error 增强版) ---
    {
      id: "wordpress",
      name: "OEON 论坛登录",
      type: "oauth",
      authorization: {
        url: "https://oeon.cc/oauth/authorize",
        params: { scope: "basic" }, // 显式声明基础权限
      },
      token: "https://oeon.cc/oauth/token",
      userinfo: "https://oeon.cc/oauth/me", 
      clientId: "Rw4MSDStMY6Ug6OIjuLpxGaGWOnbBcW6EVJ8uuBL", 
      clientSecret: "3VWWz25lL2jaSkjl6W9Q2wRCNHSaowgk1lZbsj8R",
      // 重要：在某些 Serverless 环境下，state 校验会导致 Server Error
      // 这里的 checks 设置为 ["none"] 可以极大提高兼容性
      checks: ["none"], 
      profile: (profile: any) => {
        console.log("OEON Profile Data:", profile);
        return {
          // 这里的逻辑确保无论 WP 插件返回什么格式，都能抓到 ID 和名字
          id: (profile.ID || profile.id || profile.sub || "").toString(),
          name: profile.display_name || profile.name || profile.user_login || "OEON User",
          email: profile.user_email || profile.email || null,
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
    // --- Linux Do ---
    {
      id: "linuxdo",
      name: "Linux Do",
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
