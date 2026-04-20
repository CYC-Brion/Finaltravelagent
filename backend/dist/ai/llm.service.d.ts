type ChatMessage = {
    role: "system" | "user" | "assistant";
    content: string;
};
export declare class LlmService {
    private readonly azureEndpoint;
    private readonly azureApiKey;
    private readonly azureDeployment;
    private readonly azureApiVersion;
    private readonly openAiApiKey;
    private readonly openAiBaseUrl;
    private readonly openAiModel;
    isConfigured(): boolean;
    chat(messages: ChatMessage[]): Promise<string | null>;
    private chatWithAzure;
    private chatWithOpenAi;
}
export {};
