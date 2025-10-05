import { AIModel } from "../enums/ai_model";
import { Language } from "../enums/language";
import { User } from "./user";

export interface Message {
    model_used: AIModel;
    message: string;
    language: Language;
}