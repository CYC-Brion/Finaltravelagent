import { Injectable } from "@nestjs/common";

type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  name?: string;
  tool_call_id?: string;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
};

export type ToolDefinition = {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, { type: string; description?: string }>;
      required?: string[];
    };
  };
};

export type ToolCall = {
  id: string;
  name: string;
  arguments: string;
};

export type ToolCallResult = {
  toolCallId: string;
  result: unknown;
};

@Injectable()
export class LlmService {
  private readonly azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  private readonly azureApiKey = process.env.AZURE_OPENAI_API_KEY;
  private readonly azureDeployment =
    process.env.AZURE_OPENAI_DEPLOYMENT ||
    process.env.AZURE_OPENAI_CHAT_DEPLOYMENT ||
    process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
  private readonly azureApiVersion =
    process.env.AZURE_OPENAI_API_VERSION || "2024-10-21";

  private readonly openAiApiKey = process.env.OPENAI_API_KEY;
  private readonly openAiBaseUrl =
    process.env.OPENAI_API_BASE || "https://api.openai.com/v1";
  private readonly openAiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";

  isConfigured() {
    return Boolean(
      (this.azureEndpoint && this.azureApiKey && this.azureDeployment) ||
        this.openAiApiKey,
    );
  }

  async chat(
    messages: ChatMessage[],
    tools?: ToolDefinition[],
    toolChoice?: "auto" | "none" | { type: "function"; function: { name: string } },
  ): Promise<{ content: string | null; toolCalls: ToolCall[] }> {
    if (this.azureEndpoint && this.azureApiKey && this.azureDeployment) {
      try {
        return await this.chatWithAzure(messages, tools, toolChoice);
      } catch (err) {
        if (tools && tools.length > 0) {
          return await this.chatWithAzure(messages, undefined, undefined);
        }
        throw err;
      }
    }

    if (this.openAiApiKey) {
      return this.chatWithOpenAi(messages, tools, toolChoice);
    }

    return { content: null, toolCalls: [] };
  }

  private async chatWithAzure(
    messages: ChatMessage[],
    tools?: ToolDefinition[],
    toolChoice?: "auto" | "none" | { type: "function"; function: { name: string } },
  ) {
    const baseEndpoint = this.azureEndpoint!.replace(/\/+$/, "");
    const body: Record<string, unknown> = {
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        name: m.name,
        tool_calls: m.tool_calls,
        tool_call_id: m.tool_call_id,
      })),
      temperature: 0.6,
    };

    if (tools && tools.length > 0) {
      body.tools = tools;
      if (toolChoice) {
        body.tool_choice = toolChoice;
      }
    }

    const response = await fetch(
      `${baseEndpoint}/openai/deployments/${this.azureDeployment}/chat/completions?api-version=${this.azureApiVersion}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": this.azureApiKey!,
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Azure OpenAI request failed with ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
          tool_calls?: Array<{ id?: string; function?: { name?: string; arguments?: string } }>;
        };
      }>;
    };

    const message = data.choices?.[0]?.message;

    const toolCalls: ToolCall[] = (message?.tool_calls || []).map((tc) => ({
      id: tc.id || "",
      name: tc.function?.name || "",
      arguments: tc.function?.arguments || "",
    }));

    return {
      content: message?.content || null,
      toolCalls,
    };
  }

  private async chatWithOpenAi(
    messages: ChatMessage[],
    tools?: ToolDefinition[],
    toolChoice?: "auto" | "none" | { type: "function"; function: { name: string } },
  ) {
    const body: Record<string, unknown> = {
      model: this.openAiModel,
      messages: messages.map((m) => ({ role: m.role, content: m.content, name: m.name })),
      temperature: 0.6,
    };

    if (tools && tools.length > 0) {
      body.tools = tools;
      if (toolChoice) {
        body.tool_choice = toolChoice;
      }
    }

    const response = await fetch(`${this.openAiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.openAiApiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with ${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
          tool_calls?: Array<{ id?: string; function?: { name?: string; arguments?: string } }>;
        };
      }>;
    };

    const message = data.choices?.[0]?.message;

    const toolCalls: ToolCall[] = (message?.tool_calls || []).map((tc) => ({
      id: tc.id || "",
      name: tc.function?.name || "",
      arguments: tc.function?.arguments || "",
    }));

    return {
      content: message?.content || null,
      toolCalls,
    };
  }
}
