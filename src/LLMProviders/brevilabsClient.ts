export interface RerankResponse {
  response: {
    object: string;
    data: Array<{
      relevance_score: number;
      index: number;
    }>;
    model: string;
    usage: {
      total_tokens: number;
    };
  };
  elapsed_time_ms: number;
}

export interface ToolCall {
  tool: any;
  args: any;
}

export interface Url4llmResponse {
  response: any;
  elapsed_time_ms: number;
}

export interface Pdf4llmResponse {
  response: any;
  elapsed_time_ms: number;
}

export interface Docs4llmResponse {
  response: any;
  elapsed_time_ms: number;
}

export interface WebSearchResponse {
  response: {
    choices: [
      {
        message: {
          content: string;
        };
      },
    ];
    citations: string[];
  };
  elapsed_time_ms: number;
}

export interface Youtube4llmResponse {
  response: {
    transcript: string;
  };
  elapsed_time_ms: number;
}

export interface Twitter4llmResponse {
  response: any;
  elapsed_time_ms: number;
}

export interface LicenseResponse {
  is_valid: boolean;
  plan: string;
}

export class BrevilabsClient {
  private static instance: BrevilabsClient;
  private pluginVersion: string = "Unknown";

  static getInstance(): BrevilabsClient {
    if (!BrevilabsClient.instance) {
      BrevilabsClient.instance = new BrevilabsClient();
    }
    return BrevilabsClient.instance;
  }

  setPluginVersion(pluginVersion: string) {
    this.pluginVersion = pluginVersion;
  }

  /**
   * Validate the license key and update the isPlusUser setting.
   * @param context Optional context object containing the features that the user is using to validate the license key.
   * @returns true if the license key is valid, false if the license key is invalid, and undefined if
   * unknown error.
   */
  async validateLicenseKey(
    _context?: Record<string, any>
  ): Promise<{ isValid: boolean | undefined; plan?: string }> {
    return { isValid: true, plan: "plus" };
  }

  async rerank(_query: string, documents: string[]): Promise<RerankResponse> {
    return {
      response: {
        object: "list",
        data: documents.map((_, index) => ({
          relevance_score: 0,
          index: index,
        })),
        model: "rerank-2-mock",
        usage: {
          total_tokens: 0,
        },
      },
      elapsed_time_ms: 0,
    };
  }

  async url4llm(_url: string): Promise<Url4llmResponse> {
    throw new Error("URL processing is disabled in this build.");
  }

  async pdf4llm(_binaryContent: ArrayBuffer): Promise<Pdf4llmResponse> {
    throw new Error("PDF processing is disabled in this build.");
  }

  async docs4llm(_binaryContent: ArrayBuffer, _fileType: string): Promise<Docs4llmResponse> {
    throw new Error("Document processing is disabled in this build.");
  }

  async webSearch(_query: string): Promise<WebSearchResponse> {
    throw new Error("Web search is disabled in this build.");
  }

  async youtube4llm(_url: string): Promise<Youtube4llmResponse> {
    throw new Error("YouTube transcriptions are disabled in this build.");
  }

  async twitter4llm(_url: string): Promise<Twitter4llmResponse> {
    throw new Error("Twitter processing is disabled in this build.");
  }
}
