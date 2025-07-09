import * as Yup from "yup";
import { Field } from "@/types/field";

export class FieldValidator {
    static coordinate_3d(field: Field, language: string): Yup.ObjectSchema<{
        easting: number;
        northing: number;
        elevation: number;
    }> {
        let validator = Yup.object({
            easting: Yup.number()
                .required(language == "pt-BR" ? "Campo obrigatório" : "Required field")
                .typeError(language == "pt-BR" ? "Coordenada inválida" : "Invalid coordinate"),
            northing: Yup.number()
                .required(language == "pt-BR" ? "Campo obrigatório" : "Required field")
                .typeError(language == "pt-BR" ? "Coordenada inválida" : "Invalid coordinate"),
            elevation: Yup.number()
                .required(language == "pt-BR" ? "Campo obrigatório" : "Required field")
                .typeError(language == "pt-BR" ? "Elevação inválida" : "Invalid elevation"),
        });

        if (field.required) {
            validator = validator.required(language == "pt-BR" ? "Campo obrigatório" : "Required field");
        }
        return validator;
    }

    static date_range(field: Field, language: string): Yup.ObjectSchema<{
        start: number;
        end: number;
    }> {
        let validator = Yup.object({
            start: Yup.date()
                .required(language == "pt-BR" ? "Campo obrigatório" : "Required field")
                .typeError(language == "pt-BR" ? "Data inválida" : "Invalid date"),
            end: Yup.date()
                .required(language == "pt-BR" ? "Campo obrigatório" : "Required field")
                .typeError(language == "pt-BR" ? "Data inválida" : "Invalid date"),
        });

        if (field.required) {
            validator = validator.required(language == "pt-BR" ? "Campo obrigatório" : "Required field");
        }
        return validator;
    }

    // Default para outros campos
    static default(field: Field, language: string): Yup.StringSchema {
        let validator = Yup.string();

        if (field.required) {
            validator = validator.required(language == "pt-BR" ? "Campo obrigatório" : "Required field");
        }

        if (field.validations?.min_length) {
            validator = validator.min(
                field.validations.min_length,
                field.validations.messages?.min_length
            );
        }

        if (field.validations?.max_length) {
            validator = validator.max(
                field.validations.max_length,
                field.validations.messages?.max_length
            );
        }

        if (field.type === "email") {
            validator = Yup.string().email(
                field.validations?.messages?.email ||
                (language === "pt-BR" ? "E-mail inválido" : "Invalid e-mail")
            );
        }
        return validator;
    }

    static ef_depth_research(field: Field, language: string): Yup.ObjectSchema<any> {
        const isPt = language === "pt-BR";

        const message = {
            required: isPt ? "Campo obrigatório" : "Required field",
            invalid: isPt ? "Valor inválido" : "Invalid value",
        };

        let validator = Yup.object({
            photos: Yup.array().of(Yup.array()),

            depth: Yup.array().of(
                Yup.object({
                    from: Yup.string().required(message.required),
                    to: Yup.string().required(message.required),
                })
            ),

            runCoreRecovery: Yup.number(),
            moisture: Yup.array().of(Yup.string()),
            volume: Yup.array().of(Yup.string()),
            hardness: Yup.array().of(Yup.string()),
            wash: Yup.array().of(Yup.string()),
            color: Yup.array().of(Yup.string()),
            induration: Yup.array().of(Yup.string()),
            grainsize: Yup.array().of(Yup.string()),
            sorting: Yup.array().of(Yup.string()),
            roundness: Yup.array().of(Yup.string()),

            clayPct: Yup.array().of(Yup.string()),
            micahPct: Yup.array().of(Yup.string()),
            shellsPct: Yup.array().of(Yup.string()),
            organicMatterPct: Yup.array().of(Yup.string()),
            lithicFragmentsPct: Yup.array().of(Yup.string()),
            hms: Yup.array().of(Yup.string()),

            lithologies: Yup.array().of(Yup.array()),
            comments: Yup.array().of(Yup.string()),
        });

        if (field.required) {
            validator = validator.required(message.required);
        }

        return validator;
    }
}