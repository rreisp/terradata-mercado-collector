import * as Yup from "yup";
import { DataValidator } from "@/core/types/data-validator";
import { DefaultFieldValidator } from "@/core/validation/default-field-validator";
import { Field } from "@/core/types/field";

export class TerradataPesquisaFrutasValidator extends DefaultFieldValidator implements DataValidator {
    constructor(language: string) {
        super(language)
    }

    private numberField = () =>
        Yup.number()
            .transform((value, originalValue) =>
                originalValue === '' || originalValue === null ? undefined : value
            )
            .typeError(this.message('invalid'))
            .positive(this.message('invalid'))
            .nullable()
            .notRequired();

    validate(field: Field, editMode: boolean): Yup.ObjectSchema<any, Yup.AnyObject, any, ""> {
        let validator: Yup.ObjectSchema<any, Yup.AnyObject, any, "">;
        const validators = {
            estabelecimento: Yup.string().trim().required(this.message('required')),
            data: Yup.string().required(),
            abacate: this.numberField(),
            abacaxi: this.numberField(),
            banana_caturra: this.numberField(),
            banana_prata: this.numberField(),
            laranja_pera_rio: this.numberField(),
            limao_tahiti: this.numberField(),
            maca_fuji: this.numberField(),
            mamao_havai: this.numberField(),
            manga_palmer: this.numberField(),
            manga_tommy: this.numberField(),
            mexerica_ponkan: this.numberField(),
            melancia: this.numberField(),
            morango: this.numberField(),
            pera: this.numberField(),
            uva_italia: this.numberField(),
        };

        if (field.id in validators) {
            validator = validators[field.id];
        } else {
            validator = this.createValidator(field);
        }
        return validator;
    }
}
