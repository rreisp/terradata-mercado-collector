import * as Yup from "yup";
import { Field } from "@/core/types/field";

export abstract class DefaultFieldValidator {
    [key: string]: any;

    static readonly MAX_COORDINATE = 9999999.99;
    protected isPT: boolean;
    protected language: string;

    constructor(language: string) {
        this.language = language;
        this.isPT = language === 'pt-BR';
    }    

    message(key: string): string {
        const message = {
            required: this.isPT ? "Campo obrigatório" : "Required field",
            invalid: this.isPT ? "Valor inválido" : "Invalid value",
            integer: this.isPT ? 'Deve ser um número inteiro' : 'Should be an integer number',
            greaterThan: this.isPT ? 'Valor deve ser maior que' : 'Value must be greater than',
            greaterOrEqualTo: this.isPT ? 'Valor deve ser maior ou igual a' : 'Value must be greater than or equal to',
            minimum: this.isPT ? 'O valor deve ser no mínimo' : 'The value must be at least',
            maximum: this.isPT ? 'O valor deve ser no máximo' : 'The value must be at most',
            invalidDate: this.isPT ? "Data inválida" : "Invalid date",
            negative: this.isPT ? 'O valor deve ser negativo' : 'The value must be negative',
            positive: this.isPT ? "O valor deve ser positivo" : "The value must be positive",
            invalidEmail: this.isPT ? "E-mail inválido" : "Invalid e-mail",
            selectOption: this.isPT ? 'Selecione uma opção' : 'Select an option',
            max2DecimalPlaces: this.isPT ? 'O valor de ter no máximo 2 casas decimais' : 'The value of having a maximum of 2 decimal places'
        };
        return message[key];
    }

    // ------------------------------------------------------------
    coordinate_3d(field: Field): Yup.ObjectSchema<{
        easting: number;
        northing: number;
        elevation: number;
    }> {
        // const this.message('required') = this.isPT ? 'Campo obrigatório' : 'Required field';
        const invalidCoordText = this.isPT ? 'Coordenada inválida' : 'Invalid coordinate';
        const elevationInvalidText = this.isPT ? 'Elevação inválida' : 'Invalid elevation';
        const positiveText = this.isPT ? 'Valor deve ser positivo' : 'Value must be positive';
        const maxText = this.isPT ? 'Valor máximo permitido é 9.999.999,99' : 'Maximum allowed is 9,999,999.99';
        const decimalsText = this.isPT ? 'São permitidas no máximo 2 casas decimais' : 'At most 2 decimal places allowed';

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
                .required(this.message('required'))            // obrigatoriedade
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
                .required(this.message('required'))
                .min(0, positiveText),

            elevation: Yup.number()
                .transform(numberTransform)
                .typeError(elevationInvalidText)
                .required(this.message('required')),
        });

        return validator;
    }

    date_range(field: Field): Yup.ObjectSchema<{
        start: number;
        end: number;
    }> {
        let validator = Yup.object({
            start: Yup.date()
                .required(this.message('required'))
                .typeError(this.message('invalidDate')),
            end: Yup.date()
                .required(this.message('required'))
                .typeError(this.message('invalidDate')),
        });
        return validator;
    }

    // Default para outros campos
    default(field: Field): Yup.StringSchema {
        let validator = Yup.string();
        if (field.min) {
            validator = Yup.number().min(
                field.min, this.message('minimum') + ' ' + field.min
            );
        }

        if (field.max) {
            validator = Yup.number().max(
                field.max, this.message('maximum') + ' ' + field.max
            );
        }

        if (field.type === "email") {
            validator = Yup.string().email(this.message('invalidEmail'));
        }

        return validator;
    }

    // Adicione um método estático que será sobrescrito
    createValidator(field: Field) {
        switch (field.type) {
            case 'coordinate_3d':
                return this.coordinate_3d(field);
            case 'date_range':
                return this.date_range(field);
            default:
                return this.default(field);
        }
    }
}