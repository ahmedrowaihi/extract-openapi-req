import { describe, it, expect } from "vitest";
import { OpenApiExtractor } from "../openapi-extractor";

describe("OpenApiExtractor", () => {
  const sampleSpec = {
    openapi: "3.0.0",
    info: {
      title: "Test API",
      version: "1.0.0",
    },
    paths: {
      "/users/{id}": {
        get: {
          operationId: "getUser",
          summary: "Get user by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
        },
      },
      "/users": {
        get: {
          operationId: "getUsers",
          summary: "Get all users",
        },
      },
      "/users/{id}/posts": {
        get: {
          operationId: "getPosts",
          summary: "Get posts by user ID",
        },
      },
      "/users/{id}/posts/{postId}": {
        get: {
          operationId: "getPost",
          summary: "Get post by user ID and post ID",
        },
      },
    },
  };

  it("should extract metadata for a valid path", () => {
    const extractor = new OpenApiExtractor();
    extractor.loadSpec(sampleSpec);

    const result = extractor.extract("/users/123", "GET");
    expect(result).toBeDefined();
    expect(result?.schema.operationId).toBe("getUser");
    expect(result?.params).toEqual({ id: "123" });
  });

  it("should extract metadata for root path", () => {
    const extractor = new OpenApiExtractor();
    extractor.loadSpec(sampleSpec);

    const result = extractor.extract("/users", "GET");
    expect(result).toBeDefined();
    expect(result?.schema.operationId).toBe("getUsers");
    expect(result?.params).toEqual({});
  });

  it("should extract metadata for nested path with one parameter", () => {
    const extractor = new OpenApiExtractor();
    extractor.loadSpec(sampleSpec);

    const result = extractor.extract("/users/123/posts", "GET");
    expect(result).toBeDefined();
    expect(result?.schema.operationId).toBe("getPosts");
    expect(result?.params).toEqual({ id: "123" });
  });

  it("should extract metadata for nested path with multiple parameters", () => {
    const extractor = new OpenApiExtractor();
    extractor.loadSpec(sampleSpec);

    const result = extractor.extract("/users/123/posts/456", "GET");
    expect(result).toBeDefined();
    expect(result?.schema.operationId).toBe("getPost");
    expect(result?.params).toEqual({ id: "123", postId: "456" });
  });

  it("should return null for non-matching path", () => {
    const extractor = new OpenApiExtractor();
    extractor.loadSpec(sampleSpec);

    const result = extractor.extract("/invalid/path", "GET");
    expect(result).toBeNull();
  });

  it("should return null for invalid method", () => {
    const extractor = new OpenApiExtractor();
    extractor.loadSpec(sampleSpec);

    const result = extractor.extract("/users/123", "POST");
    expect(result).toBeNull();
  });

  it("should return null when spec is not loaded", () => {
    const extractor = new OpenApiExtractor();
    const result = extractor.extract("/users/123", "GET");
    expect(result).toBeNull();
  });
});
