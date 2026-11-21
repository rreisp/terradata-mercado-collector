import * as Yup from "yup";
import { DataValidator } from "@/core/types/data-validator";
import { DefaultFieldValidator } from "@/core/validation/default-field-validator";
import { Field } from "@/core/types/field";

export class TerradataPesquisaBarbeariaValidator extends DefaultFieldValidator implements DataValidator {
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
            data: Yup.string().required(this.message('required')),
            barba: this.numberField(),
            cabelo: this.numberField(),
        };

        if (field.id in validators) {
            validator = validators[field.id];
        } else {
            validator = this.createValidator(field);
        }
        return validator;
    }
}
