import type { MiddlewareHandler } from "hono";
import { OpenApiExtractor, OpenApiRequestMetadata } from "../openapi-extractor";

export type HonoOpenApiVariables = {
  openapi: OpenApiRequestMetadata;
};

/**
 * Creates a Hono middleware that extracts OpenAPI metadata and attaches it to the request context
 * @param extractor OpenApiExtractor instance
 * @returns Hono middleware handler
 */
export function createHonoMiddleware<
  T extends { Variables: HonoOpenApiVariables },
  P extends string
>(extractor: OpenApiExtractor): MiddlewareHandler<T, P> {
  return async (c, next) => {
    const path = c.req.path;
    const method = c.req.method;

    const metadata = extractor.extract(path, method);
    if (metadata) {
      c.set("openapi", metadata);
    }

    await next();
  };
}
