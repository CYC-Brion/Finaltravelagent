type ChatMessage = {
    role: "system" | "user" | "assistant" | "tool";
    content: string | null;
    name?: string;
    tool_call_id?: string;
    tool_calls?: Array<{
        id: string;
        type: "function";
        function: {
            name: string;
            arguments: string;
        };
    }>;
};
export type ToolDefinition = {
    type: "function";
    function: {
        name: string;
        description: string;
        parameters: {
            type: "object";
            properties: Record<string, {
                type: string;
                description?: string;
            }>;
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
export declare class LlmService {
    private readonly azureEndpoint;
    private readonly azureApiKey;
    private readonly azureDeployment;
    private readonly azureApiVersion;
    private readonly openAiApiKey;
    private readonly openAiBaseUrl;
    private readonly openAiModel;
    isConfigured(): boolean;
    chat(messages: ChatMessage[], tools?: ToolDefinition[], toolChoice?: "auto" | "none" | {
        type: "function";
        function: {
            name: string;
        };
    }): Promise<{
        content: string | null;
        toolCalls: ToolCall[];
    }>;
    private chatWithAzure;
    private chatWithOpenAi;
}
export {};
