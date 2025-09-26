import { ValidationMessages } from "./validation-messages";

export type FieldValidations = {
    min_length?: number;
    max_length?: number;
    messages: ValidationMessages;
};