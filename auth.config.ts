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
      // 子比主题标准的授权端点
      authorization: "https://oeon.cc/oauth/authorize",
      token: "https://oeon.cc/oauth/token",
      // 重点：子比主题通常使用这个路径获取用户信息
      userinfo: "https://oeon.cc/oauth/get_userinfo", 
      clientId: env.WP_CLIENT_ID, 
      clientSecret: env.WP_CLIENT_SECRET,
      checks: ["none"], 
      profile: (profile: any) => {
        // 子比主题返回的数据通常包裹在 data 节点或根节点下
        console.log("Zibll Profile Raw:", profile);
        
        const user = profile.data || profile;
        const userId = (user.id || user.ID || user.openid || "").toString();

        return {
          id: userId,
          name: user.display_name || user.name || user.nickname || "OEON_User",
          // 子比可能不返回 email，这里必须给 Prisma 一个兜底值
          email: user.email || user.user_email || `${userId}@oeon.cc`,
          image: user.avatar || user.avatar_url || null,
        };
      },
    },
    // --- 以下保持不变 ---
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
