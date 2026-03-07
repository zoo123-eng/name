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
      authorization: "https://oeon.cc/oauth/authorize?scope=basic",
      token: "https://oeon.cc/oauth/token",
      userinfo: "https://oeon.cc/oauth/me", 
      clientId: env.WP_CLIENT_ID, 
      clientSecret: env.WP_CLIENT_SECRET,
      checks: ["none"], 
      profile: (profile: any) => {
        // 兼容不同的返回结构
        const user = profile.user || profile;
        const id = (user.ID || user.id || "").toString();
        const email = user.user_email || user.email;

        return {
          id: id,
          name: user.display_name || user.username || user.name || "OEON_User",
          // PrismaAdapter 必须要求唯一 email
          // 如果论坛没返回 email，我们根据 ID 生成一个伪邮箱，防止数据库写入失败
          email: email || `${id}@oeon.cc`, 
          image: user.avatar_url || null,
        };
      },
    },
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
