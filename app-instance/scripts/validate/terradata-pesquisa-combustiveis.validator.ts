import * as Yup from "yup";
import { DataValidator } from "@/core/types/data-validator";
import { DefaultFieldValidator } from "@/core/validation/default-field-validator";
import { Field } from "@/core/types/field";

export class TerradataPesquisaCombustiveisValidator extends DefaultFieldValidator implements DataValidator {
    constructor(language: string) {
        super(language)
    }

    private priceField = () =>
        Yup.number()
            .transform((value, originalValue) =>
                originalValue === '' || originalValue === null ? undefined : value
            )
            .typeError(this.message('invalid'))
            .positive(this.message('invalid'))
            .nullable()
            .notRequired();

    private mandatoryPriceField = () =>
        this.priceField()
            .required(this.message('required'));


    validate(field: Field, editMode: boolean): Yup.ObjectSchema<any, Yup.AnyObject, any, ""> {
        let validator: Yup.ObjectSchema<any, Yup.AnyObject, any, "">;
        const validators = {
            estabelecimento: Yup.string().trim().required(this.message('required')),
            data: Yup.string().required(this.message('required')),            
            etanol: this.mandatoryPriceField(),
            gasolina: this.mandatoryPriceField(),
            gasolina_aditivada: this.priceField(),
            gasolina_premium: this.priceField(),
            diesel_s10: this.priceField(),
            diesel_s500: this.priceField(),
            arla: this.priceField()
        };

        if (field.id in validators) {
            validator = validators[field.id];
        } else {
            validator = this.createValidator(field);
        }
        return validator;
    }
}