import {
    dollarValidator,
    emailValidator,
    numberValidator,
    requiredValidator,
    ValidationRule,
    zipCodeValidator,
} from '../../services/validate-service';

export class FormEntity {
    fields: Array<FormField> = []
    instructions?: string = ''
    header: string = ''
    focusFieldName: string = ''
}
export interface ISelectOption {
    value: any,
    text: string
}
export interface IFormField {
    name: string
    prefix?: string  //prefix icon, string should be name of material icon
    type: number
    validation?: Array<ValidationType>
    friendlyName?:string
    isFocusElement?:boolean // the field to be active when form loads
    options?: Array<ISelectOption>
    isMultiSelect?: boolean 
    AutocompleteSelectHandler?: Function
    AutocompleteRemoveHandler?: Function
    selectedOptions?:Array<ISelectOption>
    show?: boolean
    defaultValue?: any
}
export class FormField implements IFormField {
    name: string = ''
    prefix?: string  //prefix icon, string should be name of material icon
    type: number = FieldType.Text
    validation?: Array<ValidationType> = []
    friendlyName:string = ''
    options?: Array<ISelectOption> = []
    isMultiSelect?: boolean = false
    AutocompleteSelectHandler?: Function
    AutocompleteRemoveHandler?: Function
    selectedOptions?:Array<ISelectOption>
    isFocusElement?:boolean // the field to be active when form loads
    show?: boolean = true   
    defaultValue?: any
    constructor(data?: IFormField) {
        data = data || new FormField();
        this.name = data.name || ''
        this.prefix = data.prefix || ''
        this.type = data.type || FieldType.Text
        this.friendlyName = data.friendlyName || data.name
        this.validation = data.validation || []
        this.options = data.options || []
        this.isMultiSelect = data.isMultiSelect || false
        this.AutocompleteSelectHandler = data.AutocompleteSelectHandler || undefined        
        this.AutocompleteRemoveHandler = data.AutocompleteRemoveHandler || undefined        
        this.selectedOptions = data.selectedOptions || []
        this.isFocusElement = data.isFocusElement || false,
        this.show = data.show
        this.defaultValue = data.defaultValue    
    }
    isRequired() {
        return this.validation && this.validation.some(x => x == ValidationType.Required)
    }
    GetValidationRules() : ValidationRule[] {
        let fieldRules = new Array<ValidationRule>()
        if(this.validation && this.validation.length > 0) {
            this.validation.forEach(rule => {
                switch(rule){
                    case ValidationType.Required:
                        fieldRules.push(requiredValidator(this.friendlyName));
                        break;
                    case ValidationType.Email:
                        fieldRules.push(emailValidator(this.friendlyName));
                        break;
                    case ValidationType.Number:
                        fieldRules.push(numberValidator(this.friendlyName));
                        break;
                    case ValidationType.Dollar:
                        fieldRules.push(dollarValidator(this.friendlyName));
                        break;
                    case ValidationType.ZipCode:
                        fieldRules.push(zipCodeValidator(this.friendlyName));
                        break;
                    }
            });
        }
        return fieldRules;  
    }
}


export enum FieldType {
    Text = 0, Select, AutoComplete, Checkbox, AutoCompleteMultiple, TextArea, DateTimePicker, Scheduler
}
export enum ValidationType {
    Required = 0, Email, Number, Dollar, ZipCode
}