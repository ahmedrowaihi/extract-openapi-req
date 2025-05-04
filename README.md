# extract-openapi-req

A lightweight TypeScript library for extracting OpenAPI metadata from HTTP requests. This package helps you easily extract and validate request metadata against your OpenAPI specifications.

## Features

- 🚀 Load OpenAPI specs from URL or object
- 🔍 Extract OpenAPI metadata and path parameters from requests
- ✨ Match request paths against OpenAPI paths
- 📘 TypeScript support with full type definitions
- 🪶 Zero dependencies (except path-to-regexp)
- 🔌 Framework agnostic - works with Express, Hono, and more!

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

#### Hono

```typescript
import { Hono } from "hono";
import { OpenApiExtractor } from "extract-openapi-req";

const app = new Hono();
const extractor = new OpenApiExtractor();
await extractor.loadSpec("./openapi.json");

app.use("*", async (c, next) => {
  const metadata = extractor.extract(c.req.path, c.req.method);
  if (metadata) {
    c.set("openapi", metadata);
  }
  await next();
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

#### Types

```typescript
interface OpenApiRequestMetadata {
  schema: OpenAPIV3.OperationObject; // Full OpenAPI operation object
  params: Record<string, string>; // Extracted path parameters
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [ahmedrowaihi](https://github.com/ahmedrowaihi)

```
open http://localhost:3000
```
