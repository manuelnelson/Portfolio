import { computed } from "vue"


const ModelSync = (props: any, emit: any) => computed({ 
  get: () => props.field, 
  set: (value) => {
    console.log("setup -> value", value)
    emit('update:field', value) }
}) 
const isActive = (field: string) => {
  return field ? field.length > 0 : false;
}


export {ModelSync, isActive}