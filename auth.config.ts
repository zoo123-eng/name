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
      id: "linuxdo", // 保持你的逻辑 ID 不变
      name: "OEON 论坛",
      type: "oauth",
      authorization: "https://oeon.cc/oauth/authorize",
      token: "https://oeon.cc/oauth/token",
      // 【核心修复】：使用你测试成功的路径 C
      userinfo: "https://oeon.cc/wp-json/wp/v2/users/me", 
      clientId: env.LinuxDo_CLIENT_ID,
      clientSecret: env.LinuxDo_CLIENT_SECRET,
      checks: ["none"], 
      profile: (profile: any) => {
        // 适配路径 C (wp/v2/users/me) 的数据解构
        // 原生接口返回的是 id, name, avatar_urls 等
        const userId = (profile.id || "").toString();
        return {
          id: userId,
          name: profile.name || profile.slug || "User",
          // 原生接口有时不返回 email，如果没返回，用 ID 拼接一个占位
          email: profile.email || `${userId}@oeon.cc`,
          // 这里的 avatar_urls 通常是一个对象，取 96 像素的头像
          image: profile.avatar_urls?.["96"] || null,
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
