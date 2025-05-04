# Examples

This directory contains example projects demonstrating how to use `extract-openapi-req` with different frameworks.

## Projects

### Hono Example

A simple Hono application that demonstrates how to:

- Extract OpenAPI metadata from requests
- Use the metadata in middleware
- Match paths and extract parameters

To run:

```bash
cd hono
npm install
npm run dev
```

Then try:

```bash
# Get metadata for root path
curl http://localhost:3001/

# Get metadata for user path with parameters
curl http://localhost:3001/users/123

# Get metadata for nested path with multiple parameters
curl http://localhost:3001/users/123/posts/456
```
