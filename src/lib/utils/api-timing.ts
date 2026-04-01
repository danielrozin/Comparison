import { NextRequest, NextResponse } from "next/server";

type RouteHandler = (
  request: NextRequest,
  context?: unknown
) => Promise<NextResponse> | NextResponse;

/**
 * Wraps an API route handler with response time logging.
 * Logs method, path, status, and duration in ms.
 */
export function withTiming(handler: RouteHandler): RouteHandler {
  return async (request: NextRequest, context?: unknown) => {
    const start = performance.now();
    const method = request.method;
    const path = request.nextUrl.pathname;

    try {
      const response = await handler(request, context);
      const duration = Math.round(performance.now() - start);

      console.log(
        `[API] ${method} ${path} ${response.status} ${duration}ms`
      );

      response.headers.set("Server-Timing", `total;dur=${duration}`);
      return response;
    } catch (error) {
      const duration = Math.round(performance.now() - start);
      console.error(
        `[API] ${method} ${path} 500 ${duration}ms ERROR:`,
        error instanceof Error ? error.message : error
      );
      throw error;
    }
  };
}
