export namespace OpenAPIV3 {
  export interface OperationObject {
    operationId?: string;
    summary?: string;
    description?: string;
    parameters?: (ParameterObject | ReferenceObject)[];
    requestBody?: RequestBodyObject | ReferenceObject;
    responses?: ResponsesObject;
    tags?: string[];
  }

  export interface ParameterObject {
    name: string;
    in: string;
    description?: string;
    required?: boolean;
    schema?: SchemaObject | ReferenceObject;
  }

  export interface RequestBodyObject {
    description?: string;
    content: { [media: string]: MediaTypeObject };
    required?: boolean;
  }

  export interface ResponsesObject {
    [code: string]: ResponseObject | ReferenceObject;
  }

  export interface ResponseObject {
    description: string;
    content?: { [media: string]: MediaTypeObject };
  }

  export interface MediaTypeObject {
    schema?: SchemaObject | ReferenceObject;
  }

  export interface SchemaObject {
    type?: string;
    format?: string;
    items?: SchemaObject | ReferenceObject;
    properties?: { [name: string]: SchemaObject | ReferenceObject };
    required?: string[];
    description?: string;
  }

  export interface ReferenceObject {
    $ref: string;
  }
}
