import Vue from 'vue';
interface validModel {
  model: any
}
export class Validate {
  errors: {
    [name:string]: ValidationError[]
  } = {}
  rules: AllValidationRules = {}
  
  isValid(form: validModel): boolean {
    //cycle through
    let that = this;
    Object.keys(this.rules).forEach(prop => {
      if(prop.split('.').length > 1) {
        let props = prop.split('.');
        that.runValidate(prop, form.model[props[1]], form);
      } else {
        that.runValidate(prop, form[prop], form);
      }
    })
    return Object.keys(that.errors).length === 0
  };

  runValidate(prop:string,val: string, form: any) {
    if(Object.keys(this.rules[prop]).length === 0)
      return true;

    let that = this;
    let errors = new Array<ValidationError>();
    this.rules[prop].forEach(validator => {
      if(!validator.rule(val, form)) {
        errors.push(new ValidationError({
          message: validator.message
        }))
      }
    });
    //add errors if any, otherwise delete
    if(errors.length > 0)
    {
      that.errors.prop = errors;
      // Vue.set(that.errors, prop, errors)
    }
    else {
      if(that.errors[prop] && that.errors[prop].length > 0) {
        delete that.errors.prop;
        // Vue.delete(that.errors, prop)
      }
    }
  }
  validate(e: any) {
    let prop = e.srcElement.name;
    let val = e.srcElement.value;
    this.runValidate(prop, val, null);
  }

  showErrors(e:any) {
    let prop = e.srcElement.name;
    return this.errors[prop] && this.errors[prop].length > 0;
  }

  constructor(validationRules: AllValidationRules) {
    this.rules = validationRules;
    this.errors = {};
  }
}

export class ValidationError {
  message: string = ''
  constructor(data?:any) {
    this.message = data.message;    
  }
}
export class AllValidationRules {
  [name:string] : ValidationRule[]
  constructor(data?: AllValidationRules) {
    if(data) {
      Object.keys(data).forEach(key => {
        this[key] = data[key];
      })  
    }
  }
}
export class ValidationRule {
  rule: (val:string, form:any) => boolean = () => true;
  message: string = ''
  constructor(data?:any) {
    if(data) {
      this.rule = data.rule;
      this.message = data.message;  
    }
  }
}
//arg array, arg[0] == conditional prop, arg[1] == conditional value, arg[2] is name
let conditionalRequiredValidator = function(args:Array<any>) {
  let name = args[2];
  return new ValidationRule({
    rule: (val:string, form:any) => {
      return conditionalRequired(form,args[0],args[1],val)
    },
    message: `${name} is required`
  })
}
let requiredValidator = function(name:string) {
  return new ValidationRule({
    rule: required,
    message: `${name} is required`
  })
}
let emailValidator = function(name:string) {
  return new ValidationRule({
    rule: email,
    message: `${name} is not valid`
  })
}
let zipCodeValidator = function(name:string) {
  return new ValidationRule({
    rule: zipCode,
    message: `${name} is not valid`
  })
}
let numberValidator = function(name:string) {
  return new ValidationRule({
    rule: number,
    message: `${name} is not a number`
  })
}
let dollarValidator = function(name:string) {
  return new ValidationRule({
    rule: dollar,
    message: `${name} is not a valid dollar amount`
  })
}
export {requiredValidator, emailValidator, numberValidator, dollarValidator, zipCodeValidator, conditionalRequiredValidator};

export function conditionalRequired(form:any, conditionProp: any, conditionalVal:any, val:any) {
  let props = conditionProp.split('.')
  if(props.length > 1) {
    if(form[props[0]][props[1]] === conditionalVal) {
      return val && val.toString().length > 0;
    }  
  }
  if(form[props[0]] === conditionalVal) {
    return val && val.toString().length > 0;
  }  
  return true;
}

export function required(val:any) {
  return val && val.toString().length > 0 && val != -1; //-1 is for select drop downs.  If we ever have a field where input could be -1 we'll need to think of a better solution
}
export function zipCode(val:any) {
  
  if(!val || val.toString().trim() === '') return true; //a required validation should cover this if necessary
  return /[0-9]{5}(?:-[0-9]{4})?/.test(val);
}
export function email(val:string) {
  return val && /^[^@]+@[^@]+\.[^@]+$/.test(val);
}
export function number(val:any) {
  if(!val || val.toString().trim() === '') return true; //a required validation should cover this if necessary
  return val && parseFloat(val);
}
export function dollar(val:any) {
  if(!val || val.toString().trim() === '') return true; //a required validation should cover this if necessary
  if(val.indexOf('.') > -1)
    return val && parseFloat(val) && val.split('.')[1].length === 2;
  return val && parseInt(val)
}
export function unicodeToText(val:string) {
  let y = val.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '')
  return y;
}