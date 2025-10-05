import { AIModel } from "../enums/ai_model";
import { Language } from "../enums/language";

export interface ChatHistory {
    id: number;
    user: number;
    user_email: string;
    message: string;
    ai_response: string;
    language: Language;
    model_used: AIModel;
    created_at: string;
}
