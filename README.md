# extract-openapi-req

A lightweight TypeScript library for extracting OpenAPI metadata from HTTP requests. This package helps you easily extract and validate request metadata against your OpenAPI specifications.

## Features

- 🚀 Load OpenAPI specs from URL or object
- 🔍 Extract OpenAPI metadata and path parameters
- ✨ Match request paths against OpenAPI paths
- 📘 Full TypeScript support
- 🪶 Zero dependencies (except path-to-regexp)
- 🔌 Framework agnostic design

## Installation

```bash
npm install extract-openapi-req
```

## Usage

```typescript
import { OpenApiExtractor } from "extract-openapi-req";

// Initialize the extractor
const extractor = new OpenApiExtractor();

// Load spec from URL
await extractor.loadSpec("https://api.example.com/openapi.json");

// Or load from object
await extractor.loadSpec(require("./openapi.json"));

// Extract metadata from a request
const metadata = extractor.extract("/v1/users/123", "GET");

if (metadata) {
  console.log("Operation ID:", metadata.schema.operationId);
  console.log("Path Parameters:", metadata.params);
  console.log("Full Operation Schema:", metadata.schema);
}
```

### Framework Integration Examples

#### Hono (Built-in Middleware)

```typescript
import { Hono } from "hono";
import { OpenApiExtractor } from "extract-openapi-req";
import {
  createHonoMiddleware,
  HonoOpenApiVariables,
} from "extract-openapi-req/frameworks/hono";

const app = new Hono<{ Variables: HonoOpenApiVariables }>();
const extractor = new OpenApiExtractor();

// Load OpenAPI spec
await extractor.loadSpec(openApiSpec);

// Add the middleware
const middleware = createHonoMiddleware(extractor);
app.use("*", middleware);

// Access OpenAPI metadata in your handlers
app.get("/users/:id", (c) => {
  const metadata = c.get("openapi");
  // Use the metadata...
});
```

#### Express

```typescript
import express from "express";
import { OpenApiExtractor } from "extract-openapi-req";

const app = express();
const extractor = new OpenApiExtractor();
await extractor.loadSpec("./openapi.json");

app.use((req, res, next) => {
  const metadata = extractor.extract(req.path, req.method);
  if (metadata) {
    req.openapi = metadata;
  }
  next();
});
```

## API Reference

### `OpenApiExtractor`

#### Methods

- `loadSpec(specOrUrl: string | object): Promise<void>`  
  Load an OpenAPI specification from a URL or object.

- `getSpec(): object | null`  
  Get the currently loaded OpenAPI specification.

- `extract(path: string, method: string): OpenApiRequestMetadata | null`  
  Extract OpenAPI metadata from a request path and method.

### Framework Middlewares

#### Hono

- `createHonoMiddleware(extractor: OpenApiExtractor): MiddlewareHandler`  
  Creates a Hono middleware that automatically extracts and attaches OpenAPI metadata to the request context.

#### Types

```typescript
interface OpenApiRequestMetadata {
  schema: OpenAPIV3.OperationObject; // Full OpenAPI operation object
  params: Record<string, string>; // Extracted path parameters
}

type HonoOpenApiVariables = {
  openapi: OpenApiRequestMetadata;
};
```

## Roadmap

Check out our [roadmap](./ROADMAP.md) for upcoming features:

- OpenAPI 2.0 & 3.1.x support
- More prebuilt framework middlewares (Express, Fastify, etc.)
- Better error messages and debugging
- Request/Response validation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [ahmedrowaihi](https://github.com/ahmedrowaihi)
