// auth.config.ts 最终版
export default {
  providers: [
    {
      id: "wordpress",
      name: "OEON 论坛",
      type: "oauth",
      authorization: "https://oeon.cc/oauth/authorize",
      token: "https://oeon.cc/oauth/token",
      userinfo: "https://oeon.cc/wp-json/wp-oauth/me", // 强制 REST API 路径
      clientId: env.WP_CLIENT_ID,
      clientSecret: env.WP_CLIENT_SECRET,
      checks: ["none"],
      profile: (profile: any) => {
        const user = profile.user || profile.data || profile;
        const userId = (user.ID || user.id || "").toString();
        return {
          id: userId,
          name: user.display_name || user.user_login || "User",
          email: user.user_email || user.email || `${userId}@oeon.cc`, // 满足 Prisma unique 约束
          image: user.avatar_url || null,
          role: "USER", // 匹配 UserRole enum
          active: 1     // 匹配 Prisma 默认值
        };
      },
    },
    // ... 其他 Provider 保留
  ],
} satisfies NextAuthConfig;
