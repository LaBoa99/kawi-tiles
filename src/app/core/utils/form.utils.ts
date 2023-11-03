import { FormGroup } from "@angular/forms";

export class FormUtils {
    static setValues(values: any, form: FormGroup){
        const keys = Object.keys(form.controls)
        form.reset()
        for(let k in keys){
            form.controls[k]?.setValue(values[k])
        }
        return form
    }
}