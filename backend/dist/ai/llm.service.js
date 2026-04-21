"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmService = void 0;
const common_1 = require("@nestjs/common");
let LlmService = class LlmService {
    constructor() {
        this.azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
        this.azureApiKey = process.env.AZURE_OPENAI_API_KEY;
        this.azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT ||
            process.env.AZURE_OPENAI_CHAT_DEPLOYMENT ||
            process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
        this.azureApiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-10-21";
        this.openAiApiKey = process.env.OPENAI_API_KEY;
        this.openAiBaseUrl = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";
        this.openAiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";
    }
    isConfigured() {
        return Boolean((this.azureEndpoint && this.azureApiKey && this.azureDeployment) ||
            this.openAiApiKey);
    }
    async chat(messages, tools, toolChoice) {
        if (this.azureEndpoint && this.azureApiKey && this.azureDeployment) {
            try {
                return await this.chatWithAzure(messages, tools, toolChoice);
            }
            catch (err) {
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
    async chatWithAzure(messages, tools, toolChoice) {
        const baseEndpoint = this.azureEndpoint.replace(/\/+$/, "");
        const body = {
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
        const response = await fetch(`${baseEndpoint}/openai/deployments/${this.azureDeployment}/chat/completions?api-version=${this.azureApiVersion}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": this.azureApiKey,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Azure OpenAI request failed with ${response.status}: ${errorText}`);
        }
        const data = (await response.json());
        const message = data.choices?.[0]?.message;
        const toolCalls = (message?.tool_calls || []).map((tc) => ({
            id: tc.id || "",
            name: tc.function?.name || "",
            arguments: tc.function?.arguments || "",
        }));
        return {
            content: message?.content || null,
            toolCalls,
        };
    }
    async chatWithOpenAi(messages, tools, toolChoice) {
        const body = {
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
        const data = (await response.json());
        const message = data.choices?.[0]?.message;
        const toolCalls = (message?.tool_calls || []).map((tc) => ({
            id: tc.id || "",
            name: tc.function?.name || "",
            arguments: tc.function?.arguments || "",
        }));
        return {
            content: message?.content || null,
            toolCalls,
        };
    }
};
exports.LlmService = LlmService;
exports.LlmService = LlmService = __decorate([
    (0, common_1.Injectable)()
], LlmService);
//# sourceMappingURL=llm.service.js.map