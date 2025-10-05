import { Language } from "../enums/language";

export interface Register {
    username: string;
    email: string;
    password: string;
    prefered_language: Language
}