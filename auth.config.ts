import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { env } from "@/env.mjs";

export default {
  providers: [
    // --- OEON 论坛登录 (标准环境变量版) ---
    {
      id: "wordpress",
      name: "OEON 论坛登录",
      type: "oauth",
      authorization: {
        url: "https://oeon.cc/oauth/authorize",
        params: { scope: "basic" },
      },
      token: "https://oeon.cc/oauth/token",
      userinfo: "https://oeon.cc/oauth/me", 
      // 改为从 env.mjs 中读取，确保部署环境一致性
      clientId: env.WP_CLIENT_ID, 
      clientSecret: env.WP_CLIENT_SECRET,
      // 保持 checks: ["none"] 以解决 Serverless 环境下的 state 校验问题
      checks: ["none"], 
      profile: (profile: any) => {
        // 自动映射 WordPress 返回的字段
        const user = profile.user || profile;
        return {
          id: (user.ID || user.id || user.sub || "").toString(),
          name: user.display_name || user.username || user.name || "OEON User",
          email: user.user_email || user.email || null,
          image: user.avatar_url || null,
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
