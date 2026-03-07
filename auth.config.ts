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
      // 重点：在子比主题 + WP OAuth Server 环境下，这个 REST API 路径最稳定
      userinfo: "https://oeon.cc/wp-json/wp-oauth/me", 
      clientId: env.WP_CLIENT_ID, 
      clientSecret: env.WP_CLIENT_SECRET,
      checks: ["none"], 
      profile: (profile: any) => {
        // 打印到 Logs 以便你观察返回的真实结构
        console.log("WP OAuth Server Raw Profile:", profile);
        
        // 自动识别子比主题可能包裹的 data 节点或插件的根节点
        const user = profile.user || profile.data || profile;
        const userId = (user.ID || user.id || "").toString();

        return {
          id: userId,
          name: user.display_name || user.user_login || user.nickname || "OEON_User",
          // PrismaAdapter 必须要求唯一 email，若为空则生成伪邮箱
          email: user.user_email || user.email || `${userId}@oeon.cc`,
          image: user.avatar_url || user.avatar || null,
        };
      },
    },
    // --- 其他配置保持不变 ---
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
