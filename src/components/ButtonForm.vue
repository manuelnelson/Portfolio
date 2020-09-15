<template>
  <div v-if="formEntity">
    <div class="form-buttons mt-8 mb-8">
      <button class="btn-secondary btn btn-large no-text p-10" :class="{'active':field.show}" :title="field.friendlyName" @click.stop="showField(field)" v-for="field in formEntity.fields" :key="field.name"><i class="material-icons">{{field.prefix}}</i></button>
    </div>
    <form-component :name="name" :save-action="saveAction" :form="formEntity">
    </form-component>
  </div>
</template>
<script lang="ts">
import { FormEntity, ValidationType, FieldType, FormField, ISelectOption } from '../store/entities/form-entity';
import { Validate, AllValidationRules, requiredValidator, emailValidator, numberValidator, dollarValidator } from '../services/validate-service';
import alertStore from '../store/modules/alert-store';
import { globalStore } from "../store/modules/global-store";
import { formStore } from "../store/modules/form-store";
import FormComponent from "./Forms/Form.vue";
import { defineComponent, ref, computed, reactive, toRefs, onMounted, SetupContext } from 'vue';
interface FormProps {
  form?: FormEntity
  defaultValues?: Object, // this is for example if we are editing an existing model. This will set the model to these values. Should match by name
  saveAction?: Function,
  name?: String
}
export default defineComponent({
  props: {
    form: FormEntity,
    defaultValues: Object, // this is for example if we are editing an existing model. This will set the model to these values. Should match by name
    saveAction: Function,
    name: String
  },

  setup(props:FormProps) {
    onMounted(() => {
      let form = props.form;
      if(!form)
        return;
      //hide all fields -- can get rid of flash is form that is passed in already has it set to false.
      form.fields.forEach(x => x.show = false);
      data.formEntity = form;
    })
    const data = reactive({
      loading: true,
      id: 0,
      formEntity: undefined as undefined | FormEntity
    })
    const showField = (field:FormField) => {
      if(!data.formEntity)
        return;
      if(field.show) {
        field.show = false;
        return;
      }
      data.formEntity.fields.forEach(x => x.show = false)
      field.show = true;
      data.formEntity.focusFieldName = field.name;
    }
    return {...toRefs(data), showField}
  },
  components: {FormComponent},
})
</script>

<style lang="stylus">
  .form-buttons
    .btn
      font-size: px-to-rem(30px) !important
      padding 20px !important
      margin 0 20px 0 0 !important
      display inline-block;
      &.active, &:focus
        color var(--text-color-highlight) !important
</style>
