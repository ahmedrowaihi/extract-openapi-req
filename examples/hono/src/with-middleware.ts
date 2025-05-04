import { serve } from "@hono/node-server";
import { OpenApiExtractor } from "extract-openapi-req";
import {
  createHonoMiddleware,
  HonoOpenApiVariables,
} from "extract-openapi-req/frameworks/hono";
import { Hono } from "hono";
import openApiSpec from "./openapi.json" assert { type: "json" };

const app = new Hono<{ Variables: HonoOpenApiVariables }>();

//-------------- OpenAPI Extractor Middleware ------------------
const extractor = new OpenApiExtractor();

extractor.loadSpec(openApiSpec);

const middleware = createHonoMiddleware(extractor);

app.use("*", middleware);
//--------------------------------

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
