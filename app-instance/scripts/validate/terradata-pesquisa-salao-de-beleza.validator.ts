import * as Yup from "yup";
import { DataValidator } from "@/core/types/data-validator";
import { DefaultFieldValidator } from "@/core/validation/default-field-validator";
import { Field } from "@/core/types/field";

export class TerradataPesquisaSalaoDeBelezaValidator extends DefaultFieldValidator implements DataValidator {
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
            corte_feminino: this.numberField(),
            depilacao_completa: this.numberField(),
            escova: this.numberField(),
            escova_progressiva: this.numberField(),
            hidratacao: this.numberField(),
            manicure: this.numberField(),
            manicure_e_pedicure: this.numberField(),
            maquiagem: this.numberField(),
            pedicure: this.numberField(),
            reestruturacao_capilar: this.numberField(),
            spa_das_maos: this.numberField(),
            spa_dos_pes: this.numberField(),
            tintura: this.numberField(),
        };

        if (field.id in validators) {
            validator = validators[field.id];
        } else {
            validator = this.createValidator(field);
        }
        return validator;
    }
}
