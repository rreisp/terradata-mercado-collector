import * as Yup from "yup";
import { Field } from "@/core/types/field";

export abstract class DefaultFieldValidator {
    [key: string]: any;

    static readonly MAX_COORDINATE = 9999999.99;

    message(key: string, language: string): string {
        const isPt = language === 'pt-BR';
        const message = {
            required: isPt ? "Campo obrigatório" : "Required field",
            invalid: isPt ? "Valor inválido" : "Invalid value",
            integer: isPt ? 'Deve ser um número inteiro' : 'Should be an integer number',
            greaterThan: isPt ? 'Valor deve ser maior que' : 'Value must be greater than',
            greaterOrEqualTo: isPt ? 'Valor deve ser maior ou igual a' : 'Value must be greater than or equal to',
            minimum: isPt ? 'O valor deve ser no mínimo' : 'The value must be at least',
            maximum: isPt ? 'O valor deve ser no máximo' : 'The value must be at most',
            invalidDate: isPt ? "Data inválida" : "Invalid date",
            negative: isPt ? 'O valor deve ser negativo' : 'The value must be negative',
            positive: isPt ? "O valor deve ser positivo" : "The value must be positive",
            invalidEmail: isPt ? "E-mail inválido" : "Invalid e-mail",
            selectOption: isPt ? 'Selecione uma opção' : 'Select an option',
            max2DecimalPlaces: isPt ? 'O valor de ter no máximo 2 casas decimais' : 'The value of having a maximum of 2 decimal places'
        };
        return message[key];
    }

    // ------------------------------------------------------------
    coordinate_3d(field: Field, language: string): Yup.ObjectSchema<{
        easting: number;
        northing: number;
        elevation: number;
    }> {
        const isPt = language === "pt-BR";
        // const this.message('required', language) = isPt ? 'Campo obrigatório' : 'Required field';
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
                .required(this.message('required', language))            // obrigatoriedade
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
                .required(this.message('required', language))
                .min(0, positiveText),

            elevation: Yup.number()
                .transform(numberTransform)
                .typeError(elevationInvalidText)
                .required(this.message('required', language)),
        });

        return validator;
    }

    date_range(field: Field, language: string): Yup.ObjectSchema<{
        start: number;
        end: number;
    }> {
        let validator = Yup.object({
            start: Yup.date()
                .required(this.message('required', language))
                .typeError(this.message('invalidDate', language)),
            end: Yup.date()
                .required(this.message('required', language))
                .typeError(this.message('invalidDate', language)),
        });
        return validator;
    }

    // Default para outros campos
    default(field: Field, language: string): Yup.StringSchema {
        let validator = Yup.string();
        const isPt = language === "pt-BR";

        if (field.min) {
            validator = Yup.number().min(
                field.min, this.message('minimum', language) + ' ' + field.min
            );
        }

        if (field.max) {
            validator = Yup.number().max(
                field.max, this.message('maximum', language) + ' ' + field.max
            );
        }

        if (field.type === "email") {
            validator = Yup.string().email(this.message('invalidEmail', language));
        }

        return validator;
    }

    // Adicione um método estático que será sobrescrito
    createValidator(field: Field, language: string) {
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