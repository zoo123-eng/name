import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { env } from "@/env.mjs";

export default {
  providers: [
    {
      id: "wordpress",
      name: "OEON 论坛登录",
      type: "oauth",
      authorization: "https://oeon.cc/oauth/authorize",
      token: "https://oeon.cc/oauth/token",
      // 由于你开启了 JWT 模式，尝试使用这个最稳健的 REST 路径
      userinfo: "https://oeon.cc/wp-json/wp-oauth/me", 
      clientId: env.WP_CLIENT_ID, 
      clientSecret: env.WP_CLIENT_SECRET,
      checks: ["none"], 
      profile: (profile: any) => {
        // 打印到 Logs 以便观察 JWT 模式下返回的具体结构
        console.log("WP JWT Profile Raw:", profile);
        
        // 自动适配：JWT 模式下数据可能直接在根部，也可能在 user 节点
        const user = profile.user || profile.data || profile;
        const userId = (user.ID || user.id || user.sub || "").toString();

        return {
          id: userId,
          name: user.display_name || user.user_login || user.nickname || "OEON_User",
          // 必须确保有 email 字段，否则 PrismaAdapter 会报错
          email: user.user_email || user.email || `${userId}@oeon.cc`,
          image: user.avatar_url || user.avatar || null,
        };
      },
    },
    // --- Google, Github, LinuxDo 保持不变 ---
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
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
