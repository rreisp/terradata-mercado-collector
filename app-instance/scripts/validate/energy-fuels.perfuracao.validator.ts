// import { Alert } from "react-native";
import * as Yup from "yup";
import { Field } from "@/core/types/field";
import { DataValidator } from "@/core/types/data-validator";
import { DefaultFieldValidator } from "@/core/validation/default-field-validator";

export class EnergyFuelsDrillingValidator extends DefaultFieldValidator implements DataValidator {
    validate(field: Field, language: string): Yup.ObjectSchema<any, Yup.AnyObject, any, ""> {
        let validator: Yup.ObjectSchema<any, Yup.AnyObject, any, "">;

        switch (field.type) {
            case "ef_depth_research":
                validator = this.ef_depth_research(field, language);
                break;
            default:
                // chama método da superclasse dinamicamente
                // const fn = super[field.type as keyof DefaultFieldValidator] as (field: Field, language: string) => Yup.ObjectSchema<any>;
                validator = DefaultFieldValidator.createValidator(field, language);
                // validator = fn(field, language);
                break;
        }

        return validator;
    }

    //  
    ef_depth_research(field: Field, language: string): Yup.ObjectSchema<any> {
        const isPt = language === "pt-BR";

        const message = {
            required: isPt ? "Campo obrigatório" : "Required field",
            invalid: isPt ? "Valor inválido" : "Invalid value",
        };

        const requiredText = isPt ? 'Campo obrigatório' : 'Required field';

        let validator = Yup.object({
            // --------------------------------------------            
            // title: Yup.string()
            //     .required('O título é obrigatório')
            //     .min(3, 'O título deve ter ao menos 3 caracteres'),
            // --------------------------------------------                
            // ef_coordinates: Yup.object({
            //     easting: Yup.number()
            //         .required(requiredText + "opa")
            //         .typeError('Coordenada inválida'),
            //     northing: Yup.number()
            //         .required(requiredText)
            //         .typeError('Coordenada inválida'),
            //     elevation: Yup.number()
            //         .required(requiredText)
            //         .typeError('Elevação inválida'),
            // }),
            // --------------------------------------------
            // tenement: Yup.string()
            //     .required(requiredText)
            //     .min(3, 'Deve ter ao menos 3 caracteres'),
            // // --------------------------------------------
            // landowner: Yup.string()
            //     .required(requiredText)
            //     .min(3, 'Deve ter ao menos 3 caracteres'),
            // --------------------------------------------
            // ef_dates: Yup.object({
            //     start: Yup.date()
            //         .required('Campo obrigatório')
            //         .typeError('Data inválida'),
            //     end: Yup.date()
            //         .required('Campo obrigatório')
            //         .typeError('Data inválida')
            // }).test(
            //     'startBeforeEnd',
            //     'Data de início deve ser menor ou igual à data de fim',
            //     (value) => {
            //         if (!value) return true; // caso seja null/undefined
            //         const { start, end } = value;
            //         return !start || !end || start <= end;
            //     }
            // ),
            // --------------------------------------------            
            // reason: Yup.string().nullable(),
            // --------------------------------------------     
            depth: Yup.array().of(
                Yup.object({
                    from: Yup.number()
                        .integer('Deve ser um número inteiro')
                        .min(0, 'Valor deve ser maior ou igual a 0')
                        .required('Campo obrigatório'),
                    to: Yup.number()
                        .integer('Deve ser um número inteiro')
                        .min(1, 'Valor deve ser maior que 0')
                        .required('Campo obrigatório')
                }).test(
                    'fromTo',
                    'O valor final deve ser maior ou igual ao inicial',
                    (val) => {
                        if (!val) return true;
                        return val.to >= val.from;
                    }
                )
            ),
            // --------------------------------------------
            recovery: Yup.array().of(
                Yup.number()
                    .integer('Deve ser um número inteiro')
                    .min(0, 'O valor deve ser no mínimo 0')
                    .max(100, 'O valor deve ser no máximo 100')
                    .required('Campo obrigatório')
            ),
            // --------------------------------------------  
            moisture: Yup.array().of(
                Yup.number()
                    .integer('Deve ser um número inteiro')
                    .min(1, 'Selecione uma opção')
                    .required('Campo obrigatório')
            ),
            // --------------------------------------------  
            volume: Yup.array().of(
                Yup.number()
                    .moreThan(0, 'O valor deve ser maior que 0')
                    .test(
                        'max-2-decimals',
                        'Máximo de 2 casas decimais',
                        (value) => (value === undefined || value === null) ? true : /^\d+(\.\d{1,2})?$/.test(String(value))
                    )
                    .required('Campo obrigatório')
            ),
            // --------------------------------------------  
            hardness: Yup.array().of(
                Yup.number()
                    .integer('Deve ser um número inteiro')
                    .min(1, 'Selecione uma opção')
                    .required('Campo obrigatório')
            ),
            // --------------------------------------------  
            wash: Yup.array().of(
                Yup.number()
                    .integer('Deve ser um número inteiro')
                    .min(1, 'Selecione uma opção')
                    .required('Campo obrigatório')
            ),
            // --------------------------------------------  
            color: Yup.array().of(
                Yup.number()
                    .integer('Deve ser um número inteiro')
                    .min(1, 'Selecione uma opção')
                    .required('Campo obrigatório')
            ),
            // --------------------------------------------  
            induration: Yup.array().of(
                Yup.number()
                    .integer('Deve ser um número inteiro')
                    .min(1, 'Selecione uma opção')
                    .required('Campo obrigatório')
            ),
            // --------------------------------------------  
            grainsize: Yup.array().of(
                Yup.number()
                    .integer('Deve ser um número inteiro')
                    .min(1, 'Selecione uma opção')
                    .required('Campo obrigatório')
            ),
            // --------------------------------------------  
            sorting: Yup.array().of(
                Yup.number()
                    .integer('Deve ser um número inteiro')
                    .min(1, 'Selecione uma opção')
                    .required('Campo obrigatório')
            ),
            // --------------------------------------------  
            roundness: Yup.array().of(
                Yup.number()
                    .integer('Deve ser um número inteiro')
                    .min(1, 'Selecione uma opção')
                    .required('Campo obrigatório')
            ),
            // --------------------------------------------              
            clayPct: Yup.array().of(
                Yup.number()
                    .min(0, 'O valor deve ser no mínimo 0.00')
                    .max(1, 'O valor deve ser no máximo 1.00')
                    .test(
                        'max-2-decimals',
                        'Máximo de 2 casas decimais',
                        (value) =>
                            value === undefined || value === null
                                ? true
                                : /^\d+(\.\d{1,2})?$/.test(String(value))
                    )
                    .required('Campo obrigatório')
            ),
            // --------------------------------------------              
            micahPct: Yup.array().of(
                Yup.number()
                    .min(0, 'O valor deve ser no mínimo 0.00')
                    .max(1, 'O valor deve ser no máximo 1.00')
                    .test(
                        'max-2-decimals',
                        'Máximo de 2 casas decimais',
                        (value) =>
                            value === undefined || value === null
                                ? true
                                : /^\d+(\.\d{1,2})?$/.test(String(value))
                    )
                    .required('Campo obrigatório')
            ),
            // --------------------------------------------              
            shellsPct: Yup.array().of(
                Yup.number()
                    .min(0, 'O valor deve ser no mínimo 0.00')
                    .max(1, 'O valor deve ser no máximo 1.00')
                    .test(
                        'max-2-decimals',
                        'Máximo de 2 casas decimais',
                        (value) =>
                            value === undefined || value === null
                                ? true
                                : /^\d+(\.\d{1,2})?$/.test(String(value))
                    )
                    .required('Campo obrigatório')
            ),
            // --------------------------------------------              
            organicMatterPct: Yup.array().of(
                Yup.number()
                    .min(0, 'O valor deve ser no mínimo 0.00')
                    .max(1, 'O valor deve ser no máximo 1.00')
                    .test(
                        'max-2-decimals',
                        'Máximo de 2 casas decimais',
                        (value) =>
                            value === undefined || value === null
                                ? true
                                : /^\d+(\.\d{1,2})?$/.test(String(value))
                    )
                    .required('Campo obrigatório')
            ),
            // --------------------------------------------              
            lithicFragmentsPct: Yup.array().of(
                Yup.number()
                    .min(0, 'O valor deve ser no mínimo 0.00')
                    .max(1, 'O valor deve ser no máximo 1.00')
                    .test(
                        'max-2-decimals',
                        'Máximo de 2 casas decimais',
                        (value) =>
                            value === undefined || value === null
                                ? true
                                : /^\d+(\.\d{1,2})?$/.test(String(value))
                    )
                    .required('Campo obrigatório')
            ),
            // --------------------------------------------  
            hms: Yup.array().of(
                Yup.number()
                    .moreThan(0, 'O valor deve ser maior que 0')
                    .test(
                        'max-2-decimals',
                        'Máximo de 2 casas decimais',
                        (value) => (value === undefined || value === null) ? true : /^\d+(\.\d{1,2})?$/.test(String(value))
                    )
                    .required('Campo obrigatório')
            ),
            // --------------------------------------------                                        
            photos: Yup.array().of(
                Yup.array().of(
                    Yup.object({
                        id: Yup.number()
                            .integer('Deve ser um número inteiro')
                            .optional()
                            .nullable(),
                        fgk_segment: Yup.number()
                            .optional()
                            .nullable(),
                        img: Yup.string()
                            .required('Campo obrigatório')
                    })
                )
            ),
            // -------------------------------------------- 
            lithologies: Yup.array().of(
                Yup.array().of(
                    Yup.object({
                        id: Yup.number()
                            .integer('Deve ser um número inteiro')
                            .optional()
                            .nullable(),
                        fgk_segment: Yup.number()
                            .integer('Deve ser um número inteiro')
                            .moreThan(0, 'Deve ser maior que 0')
                            .optional()
                            .nullable(),
                        from: Yup.number()
                            .integer('Deve ser um número inteiro')
                            .min(0, 'Deve ser maior ou igual a 0')
                            .required('Campo obrigatório'),
                        to: Yup.number()
                            .integer('Deve ser um número inteiro')
                            .min(0, 'Deve ser maior ou igual a 0')
                            .required('Campo obrigatório')
                            .test(
                                'depth-to-gte-from',
                                'depth_to deve ser maior ou igual a from',
                                function (value) {
                                    return value >= this.parent.from;
                                }
                            ),
                        type: Yup.number()
                            .integer('Deve ser um número inteiro')
                            .moreThan(0, 'Selecione uma opção')
                            .required('Campo obrigatório'),
                    })
                )
            ),
            // --------------------------------------------    
            comments: Yup.array().of(Yup.string()),
        });

        if (field.validations?.required) {
            validator = validator.required(message.required);
        }

        return validator;
    }
}