import type { MatchFunction } from "path-to-regexp";
import { match } from "path-to-regexp";
import type { OpenAPIV3 } from "./types/index.js";

export interface OpenApiRequestMetadata {
  schema: OpenAPIV3.OperationObject;
  params: Record<string, string>;
  paths: {
    original: string; // OpenAPI path with {param} syntax
    converted: string; // Express-style path with :param syntax
  };
}

interface PathPattern {
  matcher: MatchFunction<object>;
  methods: { [method: string]: string | undefined };
  pathMetadata: { [method: string]: OpenAPIV3.OperationObject };
  paths: {
    original: string;
    converted: string;
  };
}

export class OpenApiExtractor {
  pathPatterns: PathPattern[];
  spec: any;

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
        paths: {
          original: path,
          converted: expressPath,
        },
      });
    }

    return pathPatterns;
  }

  private getOpenApiMetadata(
    path: string,
    method: string
  ): OpenApiRequestMetadata | null {
    for (const { matcher, pathMetadata, paths } of this.pathPatterns) {
      const matchResult = matcher(path);
      if (matchResult) {
        const schema = pathMetadata[method];
        if (schema) {
          return {
            schema,
            params: matchResult.params as Record<string, string>,
            paths,
          };
        }
      }
    }

    return null;
  }
}
