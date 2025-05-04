import { serve } from "@hono/node-server";
import { OpenApiExtractor, OpenApiRequestMetadata } from "extract-openapi-req";
import { Hono } from "hono";
import openApiSpec from "./openapi.json" assert { type: "json" };

type Variables = {
  openapi: OpenApiRequestMetadata;
};

const app = new Hono<{ Variables: Variables }>();
const extractor = new OpenApiExtractor();

// Load the OpenAPI spec
extractor.loadSpec(openApiSpec);

// Middleware to extract OpenAPI metadata
app.use("*", async (c, next) => {
  const path = c.req.path;
  const method = c.req.method;

  const metadata = extractor.extract(path, method);
  if (metadata) {
    // Attach metadata to the context for use in handlers
    c.set("openapi", metadata);
  }

  await next();
});

// Wildcard route to return OpenAPI metadata
app.all("*", (c) => {
  const metadata = c.get("openapi");
  if (!metadata) {
    return c.json({ error: "No OpenAPI metadata found for this route" }, 404);
  }

  return c.json(metadata);
});

// Error handling
app.onError((err, c) => {
  console.error("Error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
