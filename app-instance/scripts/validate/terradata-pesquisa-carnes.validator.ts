import * as Yup from "yup";
import { DataValidator } from "@/core/types/data-validator";
import { DefaultFieldValidator } from "@/core/validation/default-field-validator";
import { Field } from "@/core/types/field";

export class TerradataPesquisaCarnesValidator extends DefaultFieldValidator implements DataValidator {
    constructor(language: string) {
        super(language);
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

    validate(field: Field, editMode: boolean): Yup.ObjectSchema<any, Yup.AnyObject, any, ""> {
        let validator: Yup.ObjectSchema<any, Yup.AnyObject, any, "">;
        const validators = {
            estabelecimento: Yup.string().trim().required(this.message('required')),
            data: Yup.string().required(),
            acem: this.priceField(),
            alcatra: this.priceField(),
            carne_moida_bovina: this.priceField(),
            contrafile: this.priceField(),
            costela_bovina: this.priceField(),
            coxao_mole: this.priceField(),
            fraldinha: this.priceField(),
            musculo: this.priceField(),
            patinho: this.priceField(),
            picanha: this.priceField(),
            asa_de_frango: this.priceField(),
            coxa_de_frango: this.priceField(),
            file_de_peito_de_frango: this.priceField(),
            peito_de_frango: this.priceField(),
            sobrecoxa_de_frango: this.priceField(),
            costelinha_suina: this.priceField(),
            linguica_suina: this.priceField(),
            lombo_suino: this.priceField(),
            panceta_barriga_suina: this.priceField(),
            pernil_suino: this.priceField(),
        };

        if (field.id in validators) {
            validator = validators[field.id];
        } else {
            validator = this.createValidator(field);
        }
        return validator;
    }
}