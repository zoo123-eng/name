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
    // 【魔改核心】：外表是 Linux Do，内核是 OEON 论坛
    {
      id: "linuxdo", // ⚠️ 必须保留这个 ID，用来骗过系统校验
      name: "OEON 论坛", // 授权页显示的名字
      type: "oauth",
      authorization: "https://oeon.cc/oauth/authorize",
      token: "https://oeon.cc/oauth/token",
      userinfo: "https://oeon.cc/wp-json/wp-oauth/me", 
      clientId: env.WP_CLIENT_ID || "missing", // 直接读取 WP 的环境变量
      clientSecret: env.WP_CLIENT_SECRET || "missing",
      checks: ["none"], // ⚠️ 必须是 none，规避 WP 插件验证问题
      profile: (profile: any) => {
        // 按照 WordPress 的格式解析数据
        const user = profile.user || profile.data || profile;
        const userId = (user.ID || user.id || "").toString();
        return {
          id: userId,
          name: user.display_name || user.user_login || "User",
          email: user.user_email || user.email || `${userId}@oeon.cc`,
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
