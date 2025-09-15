import * as Yup from "yup";
import { Field } from "@/core/types/field";

export abstract class DefaultFieldValidator {
    [key: string]: any;

    static readonly MAX_COORDINATE = 9999999.99;

    static getMessageForKey(key: string, type: string, validator: Yup.ObjectSchema<any>): string {
        let msg = "";

        // Valores de "placeholder" que sabemos que falharão a validação.
        const minPlaceholder = -1; // Para forçar um erro de min para números
        const maxPlaceholder = 999999999; // Para forçar um erro de max para números
        const stringPlaceholder = "a"; // Para forçar um erro de min de string (tamanho)
        const longStringPlaceholder = "a".repeat(1000); // Para forçar um erro de max de string (tamanho)

        try {
            switch (type) {
                case "required":
                    validator.validateSyncAt(key, undefined);
                    break;
                case "typeError":
                    validator.validateSyncAt(key, '');
                    break;
                case "min":
                    // Tenta forçar o erro para um número ou string, dependendo do campo
                    // O Yup irá ignorar o tipo incorreto e validar apenas o que for aplicável
                    try {
                        validator.validateSyncAt(key, minPlaceholder);
                    } catch (numErr) {
                        validator.validateSyncAt(key, stringPlaceholder);
                    }
                    break;
                case "max":
                    console.warn('opa');
                    // Similarmente, tenta forçar o erro para um número ou string
                    try {
                        validator.validateSyncAt(key, maxPlaceholder);
                    } catch (numErr) {
                        validator.validateSyncAt(key, longStringPlaceholder);
                    }
                    break;
            }
        } catch (err: any) {
            msg = err.message;
            console.warn(msg);
        }
        return msg;
    }

    // ------------------------------------------------------------
    static coordinate_3d(field: Field, language: string): Yup.ObjectSchema<{
        easting: number;
        northing: number;
        elevation: number;
    }> {
        const isPt = language === "pt-BR";
        const requiredText = isPt ? 'Campo obrigatório' : 'Required field';
        const invalidCoordText = isPt ? 'Coordenada inválida' : 'Invalid coordinate';
        const elevationInvalidText = isPt ? 'Elevação inválida' : 'Invalid elevation';
        const positiveText = isPt ? 'Valor deve ser positivo' : 'Value must be positive';
        const maxText = isPt ? 'Valor máximo permitido é 9.999.999,99' : 'Maximum allowed is 9,999,999.99';
        const decimalsText = isPt ? 'São permitidas no máximo 2 casas decimais' : 'At most 2 decimal places allowed';

        // Transform: normaliza string (vírgula -> ponto), espaços, e converte para number.
        // Se originalValue for '', null ou undefined, retorna undefined para que .required() funcione.
        function numberTransform(this: any, value: any, originalValue: any) {
            if (originalValue === '' || originalValue === null || originalValue === undefined) return undefined;
            const str = typeof originalValue === 'string'
                ? originalValue.replace(/\s+/g, '').replace(',', '.')
                : String(originalValue);
            const num = Number(str);
            return Number.isNaN(num) ? NaN : num;
        }

        let validator = Yup.object({
            easting: Yup.number()
                .transform(numberTransform)
                .typeError(invalidCoordText)        // se não for número após transform
                .required(requiredText)            // obrigatoriedade
                .min(0, positiveText)              // positivo (>= 0)
                .max(9999999.99, maxText)          // limite com decimais
                .test(
                    'max-decimals',
                    decimalsText,
                    (value) => {
                        // Se value for undefined/null/NaN, deixa passar aqui (outros validators tratam)
                        if (value === undefined || value === null || Number.isNaN(value)) return true;
                        const parts = String(value).split('.');
                        return parts.length === 1 || parts[1].length <= 2;
                    }
                ),

            northing: Yup.number()
                .transform(numberTransform)
                .typeError(invalidCoordText)
                .required(requiredText)
                .min(0, positiveText),

            elevation: Yup.number()
                .transform(numberTransform)
                .typeError(elevationInvalidText)
                .required(requiredText),
        });

        // Se o campo (objeto) for obrigatório em nível de schema JSON
        if (field.validations?.required) {
            validator = validator.required(requiredText);
        }

        return validator;
    }


    static date_range(field: Field, language: string): Yup.ObjectSchema<{
        start: number;
        end: number;
    }> {
        let validator = Yup.object({
            start: Yup.date()
                .required(language == "pt-BR" ? "Campo obrigatório1" : "Required field")
                .typeError(language == "pt-BR" ? "Data inválida" : "Invalid date"),
            end: Yup.date()
                .required(language == "pt-BR" ? "Campo obrigatório2" : "Required field")
                .typeError(language == "pt-BR" ? "Data inválida" : "Invalid date"),
        });

        if (field.validations?.required) {
            validator = validator.required(language == "pt-BR" ? "Campo obrigatório3" : "Required field");
        }
        return validator;
    }

    // Default para outros campos
    static default(field: Field, language: string): Yup.StringSchema {
        let validator = Yup.string();

        if (field.validations?.required) {
            if (field.validations?.messages?.required) {
                let msg = field.validations?.messages?.required[language];
                validator = validator.required(msg);
            } else {
                validator = validator.required(language == "pt-BR" ? "Campo obrigatório" : "Required field");
            }
        }

        if (field.validations?.min_length) {
            if (field.validations?.messages?.min_length) {
                let msg = field.validations?.messages?.min_length[language];
                validator = validator.min(
                    field.validations.min_length,
                    msg
                );
            } else {
                validator = validator.min(
                    field.validations.min_length,
                    language == "pt-BR" ? `O campo deve ter no mínimo ${field.validations.min_length} caracteres` : `The field must be at least ${field.validations.min_length} characters`
                );
            }
        }

        if (field.validations?.max_length) {
            if (field.validations?.messages?.max_length) {
                let msg = field.validations?.messages?.max_length[language];
                validator = validator.min(
                    field.validations.max_length,
                    msg
                );
            } else {
                validator = validator.min(
                    field.validations.max_length,
                    language == "pt-BR" ? `O campo deve ter no máximo ${field.validations.max_length} caracteres` : `The field must be at least ${field.validations.max_length} characters`
                );
            }
        }

        if (field.type === "email") {
            validator = Yup.string().email(
                field.validations?.messages?.email ||
                (language === "pt-BR" ? "E-mail inválido" : "Invalid e-mail")
            );
        }
        return validator;
    }


    // Adicione um método estático que será sobrescrito
    static createValidator(field: Field, language: string) {
        switch (field.type) {
            case 'coordinate_3d':
                return this.coordinate_3d(field, language);
            case 'date_range':
                return this.date_range(field, language);
            default:
                return this.default(field, language);
        }
    }
}