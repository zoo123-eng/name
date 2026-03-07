import { NextResponse } from "next/server";
import { ipAddress } from "@vercel/functions";
import { auth } from "auth";
import { NextAuthRequest } from "next-auth/lib";
import { siteConfig } from "./config/site";
import { extractRealIP, getGeolocation, getUserAgent } from "./lib/geo";
import { extractHost } from "./lib/utils";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

const isVercel = process.env.VERCEL;
const PORTAL_DOMAIN = extractHost(process.env.NEXT_PUBLIC_APP_URL || "localhost");

const redirectMap = { "Missing[0000]": "/link-status?error=missing&slug=", "Expired[0001]": "/link-status?error=expired&slug=", "Disabled[0002]": "/link-status?error=disabled&slug=", "Error[0003]": "/link-status?error=system&slug=", "PasswordRequired[0004]": "/password-prompt?error=0&slug=", "IncorrectPassword[0005]": "/password-prompt?error=1&slug=" };
const systemRoutes = ["/docs", "/dashboard", "/admin", "/feedback", "/pricing", "/plan", "/privacy", "/terms", "/auth", "/login", "/register", "/emails", "/link-status", "/password-prompt", "/chat", "/manifest.json", "/robots.txt", "/opengraph-image.jpg", "/favicon.ico"];

export default auth(async (req: NextAuthRequest) => {
  try {
    const { pathname } = new URL(req.nextUrl);
    
    // 【核心修复】放行 API，防止授权回调被拦截
    if (pathname.startsWith("/api")) {
      return NextResponse.next();
    }

    const hostname = req.headers.get("host") || "";
    if (getHostname(hostname) !== PORTAL_DOMAIN && pathname === "/") {
      const portalUrl = `https://${PORTAL_DOMAIN}?redirect=${hostname}`;
      return NextResponse.redirect(portalUrl, 302);
    }

    return await handleShortUrl(req);
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
});

function getHostname(hostname: string): string { return hostname.split(":")[0].toLowerCase(); }

async function handleShortUrl(req: NextAuthRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const isSystemRoute = systemRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
  if (isSystemRoute || pathname === "/") return NextResponse.next();
  const slug = pathname.substring(1);
  if (!slug || slug.includes("/")) return NextResponse.next();
  return await processShortUrl(req, slug, url);
}

async function processShortUrl(req: NextAuthRequest, slug: string, url: URL) {
  const headers = req.headers;
  const ip = isVercel ? ipAddress(req) : extractRealIP(headers);
  const ua = getUserAgent(req);
  const geo = await getGeolocation(req, ip || "::1");
  const res = await fetch(`${siteConfig.url}/api/s`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, ip, city: geo?.city, device: ua.device.model, browser: ua.browser.name }),
  });
  if (!res.ok) return NextResponse.next();
  const target = await res.json();
  return typeof target === "string" ? NextResponse.redirect(target, 302) : NextResponse.next();
}
