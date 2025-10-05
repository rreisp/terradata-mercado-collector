import * as Yup from "yup";
import { DataValidator } from "@/core/types/data-validator";
import { DefaultFieldValidator } from "@/core/validation/default-field-validator";
import { Field } from "@/core/types/field";
import { CrudService } from "@/core/services/crud.service";
import { DrillingRecord } from "@/app-instance/types/drilling-record";

export class EnergyFuelsDrillingValidator extends DefaultFieldValidator implements DataValidator {
    titleRegex = /^[A-Z]{2}\d{3}-\d{3}$/;
    tenementRegex = /^\d{3}\.\d{3}\/\d{4}$/;

    validate(field: Field, language: string, editMode: boolean): Yup.ObjectSchema<any, Yup.AnyObject, any, ""> {
        const isPt = language === 'pt-BR';
        const requiredMsg = this.message('required', language);
        const formatMsg = isPt ? 'O formato deve ser ' : 'The format should be ';
        const duplicateTitleValueMsg = isPt ? 'Perfuração já registrado' : 'Drilling already registered';
        const finalGreaterThanInitialMsg = isPt ? 'O valor final deve ser maior do que o inicial' : 'The final value must be greater than the initial value';

        let validator: Yup.ObjectSchema<any, Yup.AnyObject, any, "">;
        const validators = {
            title: Yup.string()
                .required(requiredMsg)
                .matches(this.titleRegex, formatMsg + 'AA000-000')
                // TODO: controlar acesso múltiplo ao banco para evitar erros nas requisições assincronas de validação
                .test(
                    'duplicateValue',
                    duplicateTitleValueMsg,
                    async (val) => {
                        if (editMode || !val || val === null || val.trim() === '') return true;
                        try {
                            return this.getDrilling(val)
                                .then(rows => rows.length < 1)
                                .catch(() => true);
                        } catch (ex) { return true }
                    }
                ),
            tenement: Yup.string()
                .required(requiredMsg)
                .matches(this.tenementRegex, formatMsg + '000.000/0000'),
            landowner: Yup.string()
                .required(requiredMsg),
            ef_dates: Yup.object({
                start: Yup.date()
                    .required(requiredMsg),
                end: Yup.date()
                    .required(requiredMsg)
            }).test(
                'startEnd',
                finalGreaterThanInitialMsg,
                (val) => {
                    if (!val) return true;
                    return val.end >= val.start;
                }
            ),
            ef_depth_test: this.ef_depth_research(field, language)
        };

        if (field.id in validators) {
            validator = validators[field.id];
        } else {
            validator = this.createValidator(field, language);
        }
        return validator;
    }

    //  
    ef_depth_research(field: Field, language: string): Yup.ObjectSchema<any> {
        const isPt = language === "pt-BR";
        const integerMsg = this.message('integer', language);
        const requiredMsg = this.message('required', language);
        const greaterThanMsg = this.message('greaterThan', language);
        const greaterOrEqualToMsg = this.message('greaterOrEqualTo', language);
        const minimumMsg = this.message('minimum', language);
        const maximumMsg = this.message('maximum', language);
        const finalGreaterThanInitialMsg = isPt ? 'O valor final deve ser maior do que o inicial' : 'The final value must be greater than the initial value';
        const selectOptionMsg = this.message('selectOption', language);


        let validator = Yup.object({
            // --------------------------------------------
            depth: Yup.array().of(
                Yup.object({
                    from: Yup.number()
                        .integer(integerMsg)
                        .min(0, greaterOrEqualToMsg + ' 0')
                        .required(requiredMsg),
                    to: Yup.number()
                        .integer(integerMsg)
                        .min(1, greaterThanMsg + ' 0')
                        .required(requiredMsg)
                }).test(
                    'fromTo',
                    finalGreaterThanInitialMsg,
                    (val) => {
                        if (!val) return true;
                        return val.to > val.from;
                    }
                )
            ),
            // --------------------------------------------
            recovery: Yup.array().of(
                Yup.number()
                    .min(0, minimumMsg + ' 0')
                    .max(100, this.message('maximum', language) + ' 100')
                    .required(requiredMsg)
            ),
            // --------------------------------------------  
            moisture: Yup.array().of(
                Yup.number()
                    .integer(integerMsg)
                    .min(1, selectOptionMsg)
                    .required(requiredMsg)
            ),
            // --------------------------------------------  
            hardness: Yup.array().of(
                Yup.number()
                    .integer(integerMsg)
                    .min(1, selectOptionMsg)
                    .required(requiredMsg)
            ),
            // --------------------------------------------  
            wash: Yup.array().of(
                Yup.number()
                    .integer(integerMsg)
                    .min(1, selectOptionMsg)
                    .required(requiredMsg)
            ),
            // --------------------------------------------  
            color: Yup.array().of(
                Yup.number()
                    .integer(integerMsg)
                    .min(1, selectOptionMsg)
                    .required(requiredMsg)
            ),
            // --------------------------------------------  
            induration: Yup.array().of(
                Yup.number()
                    .integer(integerMsg)
                    .min(1, selectOptionMsg)
                    .required(requiredMsg)
            ),
            // --------------------------------------------  
            minGrainsize: Yup.array().of(
                Yup.number()
                    .integer(integerMsg)
                    .min(1, selectOptionMsg)
                    .required(requiredMsg)
            ),
            // --------------------------------------------  
            maxGrainsize: Yup.array().of(
                Yup.number()
                    .integer(integerMsg)
                    .min(1, selectOptionMsg)
                    .required(requiredMsg)
            ),
            // --------------------------------------------  
            roundness: Yup.array().of(
                Yup.number()
                    .integer(integerMsg)
                    .min(1, selectOptionMsg)
                    .required(requiredMsg)
            ),
            // --------------------------------------------              
            clayPct: Yup.array().of(
                Yup.number()
                    .min(0, minimumMsg + ' 0')
                    .max(100, maximumMsg + ' 100')
                    .test(
                        'max-2-decimals',
                        this.message('max2DecimalPlaces', language),
                        (value) =>
                            value === undefined || value === null
                                ? true
                                : /^\d+(\.\d{1,2})?$/.test(String(value))
                    )
                    .required(requiredMsg)
            ),
            // --------------------------------------------              
            micahPct: Yup.array().of(
                Yup.number()
                    .min(0, minimumMsg + ' 0')
                    .max(100, maximumMsg + ' 100')
                    .test(
                        'max-2-decimals',
                        this.message('max2DecimalPlaces', language),
                        (value) =>
                            value === undefined || value === null
                                ? true
                                : /^\d+(\.\d{1,2})?$/.test(String(value))
                    )
                    .required(requiredMsg)
            ),
            // --------------------------------------------              
            shellsPct: Yup.array().of(
                Yup.number()
                    .min(0, minimumMsg + ' 0')
                    .max(100, maximumMsg + ' 100')
                    .test(
                        'max-2-decimals',
                        this.message('max2DecimalPlaces', language),
                        (value) =>
                            value === undefined || value === null
                                ? true
                                : /^\d+(\.\d{1,2})?$/.test(String(value))
                    )
                    .required(requiredMsg)
            ),
            // --------------------------------------------              
            organicMatterPct: Yup.array().of(
                Yup.number()
                    .min(0, minimumMsg + ' 0')
                    .max(100, maximumMsg + ' 100')
                    .test(
                        'max-2-decimals',
                        this.message('max2DecimalPlaces', language),
                        (value) =>
                            value === undefined || value === null
                                ? true
                                : /^\d+(\.\d{1,2})?$/.test(String(value))
                    )
                    .required(requiredMsg)
            ),
            // --------------------------------------------              
            lithicFragmentsPct: Yup.array().of(
                Yup.number()
                    .min(0, minimumMsg + ' 0')
                    .max(100, maximumMsg + ' 100')
                    .test(
                        'max-2-decimals',
                        this.message('max2DecimalPlaces', language),
                        (value) =>
                            value === undefined || value === null
                                ? true
                                : /^\d+(\.\d{1,2})?$/.test(String(value))
                    )
                    .required(requiredMsg)
            ),
            // --------------------------------------------  
            hms: Yup.array().of(
                Yup.number()
                    .moreThan(0, greaterThanMsg + ' 0')
                    .test(
                        'max-2-decimals',
                        this.message('max2DecimalPlaces', language),
                        (value) => (value === undefined || value === null) ? true : /^\d+(\.\d{1,2})?$/.test(String(value))
                    )
                    .required(requiredMsg)
            ),
            // --------------------------------------------                                        
            photos: Yup.array().of(
                Yup.array().of(
                    Yup.object({
                        id: Yup.number()
                            .integer(integerMsg)
                            .optional()
                            .nullable(),
                        fgk_segment: Yup.number()
                            .optional()
                            .nullable(),
                        img: Yup.string()
                            .required(requiredMsg)
                    })
                )
            ),
            // -------------------------------------------- 
            lithologies: Yup.array().of(
                Yup.array().of(
                    Yup.object({
                        id: Yup.number()
                            .integer(integerMsg)
                            .optional()
                            .nullable(),
                        fgk_segment: Yup.number()
                            .integer(integerMsg)
                            .moreThan(0, greaterThanMsg + ' 0')
                            .optional()
                            .nullable(),
                        from: Yup.number()
                            .required(isPt ? "Campos obrigatórios" : "Required fields",)
                            .integer(integerMsg)
                            .min(0, greaterThanMsg + ' 0'),
                        to: Yup.number()
                            .required(isPt ? "Campos obrigatórios" : "Required fields",)
                            .integer(integerMsg)
                            .min(0, greaterThanMsg + ' 0')
                            .test(
                                'depth-to-gte-from',
                                finalGreaterThanInitialMsg,
                                function (value) {
                                    return value >= this.parent.from;
                                }
                            ),
                        type: Yup.number()
                            .integer(integerMsg)
                            .moreThan(0, selectOptionMsg)
                            .required(requiredMsg),
                    })
                )
            ),
            // --------------------------------------------    
            comments: Yup.array().of(Yup.string()),
        });

        return validator;
    }

    async getDrilling(title: string) {
        const result = await CrudService.list<DrillingRecord>(
            "drillings",
            ["title="],
            [title]
        )

        return result
    }
}