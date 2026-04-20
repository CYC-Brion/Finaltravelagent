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
    async chat(messages) {
        if (this.azureEndpoint && this.azureApiKey && this.azureDeployment) {
            return this.chatWithAzure(messages);
        }
        if (this.openAiApiKey) {
            return this.chatWithOpenAi(messages);
        }
        return null;
    }
    async chatWithAzure(messages) {
        const baseEndpoint = this.azureEndpoint.replace(/\/+$/, "");
        const response = await fetch(`${baseEndpoint}/openai/deployments/${this.azureDeployment}/chat/completions?api-version=${this.azureApiVersion}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": this.azureApiKey,
            },
            body: JSON.stringify({
                messages,
                temperature: 0.6,
            }),
        });
        if (!response.ok) {
            throw new Error(`Azure OpenAI request failed with ${response.status}`);
        }
        const data = (await response.json());
        return data.choices?.[0]?.message?.content?.trim() || null;
    }
    async chatWithOpenAi(messages) {
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
        const data = (await response.json());
        return data.choices?.[0]?.message?.content?.trim() || null;
    }
};
exports.LlmService = LlmService;
exports.LlmService = LlmService = __decorate([
    (0, common_1.Injectable)()
], LlmService);
//# sourceMappingURL=llm.service.js.map