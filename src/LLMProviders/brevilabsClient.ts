import { logError } from "@/logger";
import { getSettings } from "@/settings/model";
import { safeFetch } from "@/utils";

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

  async webSearch(query: string): Promise<WebSearchResponse> {
    const startTime = Date.now();
    const settings = getSettings();
    const apiKey = settings.tavilyApiKey;

    if (!apiKey) {
      throw new Error("Tavily API key is missing. Please add it in settings to enable web search.");
    }

    try {
      const response = await safeFetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: apiKey,
          query: query,
          search_depth: "basic",
          include_answer: true,
          max_results: 5,
        }),
      });

      const data = await response.json();
      const elapsed = Date.now() - startTime;

      if (!data || data.error) {
        throw new Error(data?.error || "Failed to fetch from Tavily API");
      }

      // Format sources for citations
      const citations = (data.results || []).map((result: any) => {
        return `${result.title}: ${result.url}`;
      });

      // Combine answer and results for the content
      let content = data.answer || "";
      if (!content && data.results && data.results.length > 0) {
        content = "Here are the search results:";
      }

      // Add snippets from results if answer is short or missing
      if (data.results && data.results.length > 0) {
        content += "\n\nSources:\n";
        data.results.forEach((result: any, index: number) => {
          content += `\n[^${index + 1}]: ${result.title} - ${result.url}\n${result.content}\n`;
        });
      }

      return {
        response: {
          choices: [
            {
              message: {
                content: content,
              },
            },
          ],
          citations: citations,
        },
        elapsed_time_ms: elapsed,
      };
    } catch (error) {
      logError("Tavily web search failed:", error);
      throw error;
    }
  }

  async youtube4llm(_url: string): Promise<Youtube4llmResponse> {
    throw new Error("YouTube transcriptions are disabled in this build.");
  }

  async twitter4llm(_url: string): Promise<Twitter4llmResponse> {
    throw new Error("Twitter processing is disabled in this build.");
  }
}
