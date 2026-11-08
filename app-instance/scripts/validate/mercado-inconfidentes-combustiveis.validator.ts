import * as Yup from "yup";
import { DataValidator } from "@/core/types/data-validator";
import { DefaultFieldValidator } from "@/core/validation/default-field-validator";
import { Field } from "@/core/types/field";
import { CrudService } from "@/core/services/crud.service";
import { CombustiveisRecord } from "@/app-instance/types/drilling-record";

export class MercadoInconfidentesCombustiveisValidator extends DefaultFieldValidator implements DataValidator {
    private titleRegex = /^[A-Z]{2}\d{3}-\d{3}$/;
    private tenementRegex = /^\d{3}\.\d{3}\/\d{4}$/;

    constructor(language: string) {
        super(language)
    }

    validate(field: Field, editMode: boolean): Yup.ObjectSchema<any, Yup.AnyObject, any, ""> {
        const requiredMsg = this.message('required');
        const formatMsg = this.isPT ? 'O formato deve ser ' : 'The format should be ';
        const duplicateTitleValueMsg = this.isPT ? 'Perfuração já registrada' : 'Combustiveis already registered';
        const finalGreaterThanInitialMsg = this.isPT ? 'A data final deve ser maior ou igual a inicial' : 'The end date must be greater than or equal to the start date';

        let validator: Yup.ObjectSchema<any, Yup.AnyObject, any, "">;
        const validators = {
            title: Yup.string()
                .required(requiredMsg)
                .matches(this.titleRegex, formatMsg + 'AA000-000')
                .test(
                    'duplicateValue',
                    duplicateTitleValueMsg,
                    async (val) => {
                        if (editMode || !val || val === null || val.trim() === '') return true;
                        try {
                            return this.getCombustiveis(val)
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
            responsible: Yup.string()
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
            ef_depth_test: this.ef_depth_research(field)
        };

        if (field.id in validators) {
            validator = validators[field.id];
        } else {
            validator = this.createValidator(field);
        }
        return validator;
    }

    //  
    ef_depth_research(field: Field): Yup.ObjectSchema<any> {
        const integerMsg = this.message('integer');
        const requiredMsg = this.message('required');
        const greaterThanMsg = this.message('greaterThan');
        const greaterOrEqualToMsg = this.message('greaterOrEqualTo');
        const minimumMsg = this.message('minimum');
        const maximumMsg = this.message('maximum');
        const finalGreaterThanInitialMsg = this.isPT ? 'O valor final deve ser maior do que o inicial' : 'The final value must be greater than the initial value';
        const selectOptionMsg = this.message('selectOption');
        const atLeastOnePhotoMsg = this.isPT ? 'Não é permitido registrar segmentos sem fotos.' : 'Segments without images cannot be registered.';

        let validator = Yup.object({
            // --------------------------------------------
            depth: Yup.array().of(
                Yup.object({
                    from: Yup.number()
                        // .integer(integerMsg)
                        .min(0, greaterOrEqualToMsg + ' 0')
                        .required(requiredMsg),
                    to: Yup.number()
                        // .integer(integerMsg)
                        .min(0.01, greaterThanMsg + ' 0')
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
                    .max(100, this.message('maximum') + ' 100')
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
            sorting: Yup.array().of(
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
                        this.message('max2DecimalPlaces'),
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
                        this.message('max2DecimalPlaces'),
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
                        this.message('max2DecimalPlaces'),
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
                        this.message('max2DecimalPlaces'),
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
                        this.message('max2DecimalPlaces'),
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
                        this.message('max2DecimalPlaces'),
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
                .min(1, atLeastOnePhotoMsg)
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
                            .required(requiredMsg)
                            // .integer(integerMsg)
                            .min(0, greaterThanMsg + ' 0'),
                        to: Yup.number()
                            .required(requiredMsg)
                            // .integer(integerMsg)
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

    async getCombustiveis(title: string) {
        try {
            const result = await CrudService.list<CombustiveisRecord>(
                "drillings",
                {
                    where: ["title = ?"],
                    params: [title]
                }
            );

            return result
        } catch (e) {
            console.error("MercadoInconfidentesCombustiveisValidator.getCombustiveis")
            console.log(e)
        }
    }
}