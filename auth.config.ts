import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { env } from "@/env.mjs";

export default {
  // 这里直接定义 providers 数组，不从外部获取开关状态
  providers: [
    // --- 论坛登录：强制显示且优先级最高 ---
    {
      id: "wordpress",
      name: "OEON 论坛登录",
      type: "oauth",
      authorization: "https://oeon.cc/oauth/authorize",
      token: "https://oeon.cc/oauth/token",
      userinfo: "https://oeon.cc/oauth/me", 
      clientId: process.env.WP_CLIENT_ID,
      clientSecret: process.env.WP_CLIENT_SECRET,
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
    // --- 保持原有 Google 登录 ---
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // --- 保持原有 Github 登录 ---
    Github({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    // --- 保持原有 Linux Do 登录 ---
    {
      id: "linuxdo",
      name: "Linux Do",
      version: "2.0",
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
    // --- 保持原有 账号密码登录 ---
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
