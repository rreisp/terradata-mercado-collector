import * as Yup from "yup";
import { DataValidator } from "@/core/types/data-validator";
import { DefaultFieldValidator } from "@/core/validation/default-field-validator";
import { Field } from "@/core/types/field";

export class TerradataPesquisaLegumesValidator extends DefaultFieldValidator implements DataValidator {
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

    validate(field: Field, editMode: boolean): Yup.ObjectSchema<any, Yup.AnyObject, any, ""> {
        let validator: Yup.ObjectSchema<any, Yup.AnyObject, any, "">;
        const validators = {
            estabelecimento: Yup.string().trim().required(this.message('required')),
            data: Yup.string().required(this.message('required')),
            abobora_moranga: this.priceField(),
            abobrinha: this.priceField(),
            acelga: this.priceField(),
            agriao: this.priceField(),
            almeirao: this.priceField(),
            alface: this.priceField(),
            alho: this.priceField(),
            alho_poro: this.priceField(),
            batata_baroa: this.priceField(),
            batata_doce_roxa: this.priceField(),
            batata_inglesa: this.priceField(),
            berinjela: this.priceField(),
            beterraba: this.priceField(),
            brocolis: this.priceField(),
            cebola_amarela: this.priceField(),
            cebola_roxa: this.priceField(),
            cebolinha: this.priceField(),
            cenoura_vermelha: this.priceField(),
            chuchu: this.priceField(),
            couve: this.priceField(),
            couve_flor: this.priceField(),
            gengibre: this.priceField(),
            inhame: this.priceField(),
            jilo: this.priceField(),
            mandioca: this.priceField(),
            pepino: this.priceField(),
            pimentao_verde: this.priceField(),
            quiabo: this.priceField(),
            repolho: this.priceField(),
            rucula: this.priceField(),
            salsinha: this.priceField(),
            tomate_italiano: this.priceField(),
            vagem: this.priceField(),
        };

        if (field.id in validators) {
            validator = validators[field.id];
        } else {
            validator = this.createValidator(field);
        }
        return validator;
    }
}
