import { Injectable } from "@nestjs/common";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
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

  async chat(messages: ChatMessage[]) {
    if (this.azureEndpoint && this.azureApiKey && this.azureDeployment) {
      return this.chatWithAzure(messages);
    }

    if (this.openAiApiKey) {
      return this.chatWithOpenAi(messages);
    }

    return null;
  }

  private async chatWithAzure(messages: ChatMessage[]) {
    const baseEndpoint = this.azureEndpoint!.replace(/\/+$/, "");
    const response = await fetch(
      `${baseEndpoint}/openai/deployments/${this.azureDeployment}/chat/completions?api-version=${this.azureApiVersion}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": this.azureApiKey!,
        },
        body: JSON.stringify({
          messages,
          temperature: 0.6,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Azure OpenAI request failed with ${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content?.trim() || null;
  }

  private async chatWithOpenAi(messages: ChatMessage[]) {
    const response = await fetch(`${this.openAiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.openAiApiKey}`,
      },
      body: JSON.stringify({
        model: this.openAiModel,
        messages,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with ${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return data.choices?.[0]?.message?.content?.trim() || null;
  }
}
