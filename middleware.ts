import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // vercel.app や localhost は除外
  if (
    host.endsWith(".vercel.app") ||
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1")
  ) {
    return NextResponse.next();
  }

  // www なし → www あり にリダイレクト
  if (!host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = `www.${host}`;
    url.protocol = "https";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 以下を除くすべてのパスにマッチ:
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化)
     * - favicon.ico, robots.txt, sitemap.xml
     * - 画像ファイル
     */
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
