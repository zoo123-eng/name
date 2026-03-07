import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
  providers: [
    {
      id: "wordpress",
      name: "OEON 论坛",
      type: "oauth",
      authorization: "https://oeon.cc/oauth/authorize",
      token: "https://oeon.cc/oauth/token",
      userinfo: "https://oeon.cc/wp-json/wp-oauth/me", 
      // 直接使用 process.env 避免 env 找不到的问题
      clientId: process.env.WP_CLIENT_ID as string,
      clientSecret: process.env.WP_CLIENT_SECRET as string,
      checks: ["none"],
      profile: (profile: any) => {
        const user = profile.user || profile.data || profile;
        const userId = (user.ID || user.id || "").toString();
        return {
          id: userId,
          name: user.display_name || user.user_login || "User",
          email: user.user_email || user.email || `${userId}@oeon.cc`,
          image: user.avatar_url || null,
          role: "USER", // 匹配 UserRole
          active: 1     // 匹配 Prisma 字段
        };
      },
    },
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    {
      id: "linuxdo",
      name: "Linux Do",
      type: "oauth",
      authorization: "https://connect.linux.do/oauth2/authorize",
      token: "https://connect.linux.do/oauth2/token",
      userinfo: "https://connect.linux.do/api/user",
      clientId: process.env.LinuxDo_CLIENT_ID,
      clientSecret: process.env.LinuxDo_CLIENT_SECRET,
      checks: ["state"],
      profile: (profile: any) => {
        return {
          id: profile.id.toString(),
          name: profile.username,
          image: profile.avatar_url,
          email: profile.email,
          role: "USER",
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
