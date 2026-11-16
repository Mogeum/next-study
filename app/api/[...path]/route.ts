import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

/**
 * 쿠키 → Authorization 헤더 번역기.
 *
 * 토큰은 httpOnly 쿠키라 브라우저 JS가 읽을 수 없다.
 * 그래서 클라이언트(httpClient)는 백엔드를 직접 부르지 않고 이 핸들러를 부르고,
 * 서버인 이 핸들러가 쿠키에서 토큰을 꺼내 Bearer 헤더로 바꿔 백엔드에 전달한다.
 *
 * 브라우저 ──→ /api/todos (여기) ──→ API_URL/todos + Authorization: Bearer ...
 */
async function handler(
  request: NextRequest,
  ctx: RouteContext<"/api/[...path]">,
) {
  const { path } = await ctx.params; // ["todos"] 또는 ["todos", "1"]
  const token = (await cookies()).get("token")?.value;

  // 쿼리스트링은 그대로 이어붙인다 (?page=1&size=20)
  const search = request.nextUrl.search;
  const url = `${process.env.API_URL}/${path.join("/")}${search}`;

  // GET/HEAD에는 body가 없다. 있으면 fetch가 에러를 던진다.
  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  const upstream = await fetch(url, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: hasBody ? await request.text() : undefined,
    cache: "no-store",
  });

  // 백엔드 응답을 상태코드까지 그대로 중계.
  // 204 No Content 등은 body가 없으므로 json 파싱하지 않는다.
  const text = await upstream.text();

  if (!text) {
    return new NextResponse(null, { status: upstream.status });
  }

  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
