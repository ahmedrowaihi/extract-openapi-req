import { match } from "path-to-regexp";
import type { MatchFunction } from "path-to-regexp";
import type { OpenAPIV3 } from "./types/index.js";

export interface OpenApiRequestMetadata {
  schema: OpenAPIV3.OperationObject;
  params: Record<string, string>;
}

interface PathPattern {
  matcher: MatchFunction<object>;
  methods: { [method: string]: string | undefined };
  pathMetadata: { [method: string]: OpenAPIV3.OperationObject };
}

export class OpenApiExtractor {
  private pathPatterns: PathPattern[];
  private spec: any;

  constructor() {
    this.pathPatterns = [];
  }

  async loadSpec(specOrUrl: string | object): Promise<void> {
    if (typeof specOrUrl === "string") {
      const response = await fetch(specOrUrl);
      this.spec = await response.json();
    } else {
      this.spec = specOrUrl;
    }
    this.pathPatterns = this.preprocessPaths(this.spec);
  }

  getSpec(): object | null {
    return this.spec;
  }

  extract(path: string, method: string): OpenApiRequestMetadata | null {
    return this.getOpenApiMetadata(path, method.toLowerCase());
  }

  private openApiToExpressPath(openApiPath: string): string {
    return openApiPath.replace(/{(\w+)}/g, ":$1");
  }

  private preprocessPaths(spec: any): PathPattern[] {
    const pathPatterns: PathPattern[] = [];

    for (const [path, methods] of Object.entries(spec.paths)) {
      const expressPath = this.openApiToExpressPath(path);
      const matcher = match(expressPath);
      const methodMap: { [method: string]: string | undefined } = {};
      const pathMetadata: { [method: string]: OpenAPIV3.OperationObject } = {};

      for (const [method, details] of Object.entries(methods as object)) {
        methodMap[method.toLowerCase()] = (details as any).operationId;
        pathMetadata[method.toLowerCase()] =
          details as OpenAPIV3.OperationObject;
      }

      pathPatterns.push({
        matcher,
        methods: methodMap,
        pathMetadata,
      });
    }

    return pathPatterns;
  }

  private getOpenApiMetadata(
    path: string,
    method: string
  ): OpenApiRequestMetadata | null {
    for (const { matcher, pathMetadata } of this.pathPatterns) {
      const matchResult = matcher(path);
      if (matchResult) {
        const schema = pathMetadata[method];
        if (schema) {
          return {
            schema,
            params: matchResult.params as Record<string, string>,
          };
        }
      }
    }

    return null;
  }
}
