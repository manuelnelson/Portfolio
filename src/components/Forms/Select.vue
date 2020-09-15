<template>
  <div class="input-field select" :class="{'active':active}">
    <i class="material-icons prefix" v-if="field.prefix">{{field.prefix}}</i>
    <label>{{label}}</label>
    <div class="select-wrapper">
      <div class="select-dropdown dropdown-trigger" v-if="!showMultiSelect">{{dropdownText}}</div>
      <div class="select-dropdown dropdown-trigger" v-if="showMultiSelect">
        <span class="select__item" @click.stop="removeItem(item)" v-for="item in selections" :key="item.value">
          {{item.text}} <i class="material-icons">close</i>
        </span>
      </div>
      <svg class="caret" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg>
      <select class="browser-default" :name="field.name" @blur="toggleOpen" @focus="toggleOpen" v-model="dropdownModel" @change="changeEvent" >
        <option v-if="!showMultiSelect" selected value="-1">- Select -</option>
        <option v-for="item in dropdownOptions" :value="item.value" :selected="isSelected(item)" :key="item.value">{{item.text}}</option>
      </select>
    </div>
  </div>

</template>
<script lang="ts">
import { ISelectOption, FormField } from '../../store/entities/form-entity';
import { defineComponent, ref, onMounted, reactive, computed, toRefs, SetupContext, watch } from 'vue';
import {ModelSync} from '../../helpers/form-helper'

interface SelectProps {
    label?: string
    placeholder?: string
    field?: FormField,
    items?: ISelectOption[],
    isMulti?: boolean,
    defaultValue?: string
}

export default defineComponent({
  setup(props:SelectProps,{emit}) {
    onMounted(() => {
      data.dropdownOptions = props.items ? props.items : [];
      var defaultItem = data.dropdownOptions.find(x => x.value == props.field)
      if(defaultItem)
        data.dropdownText = defaultItem.text;
      else
        data.dropdownText = props.placeholder || "Select"
    })

    const data = reactive({
      dropdownText: '',
      active: false,
      selections: [] as ISelectOption[],
      dropdownOptions: [] as ISelectOption[]
    })

    //computed
    const showMultiSelect = computed(() : boolean => {
      return data.selections.length > 0
    })
    const dropdownModel = ModelSync(props,emit);

    watch(() => props.defaultValue, (newValue:string|undefined) => {
      var defaultItem = data.dropdownOptions.find(x => x.value == props.field)
      if(defaultItem)
        data.dropdownText = defaultItem.text;
      else
        data.dropdownText = props.placeholder || "Select"
    })
    watch(() => props.items, (newValue:ISelectOption[] | undefined) => {
      data.dropdownOptions = newValue ? newValue : []
    })

    const toggleOpen = () : void => {
      data.active = !data.active;
    }
    const removeItem = (item:ISelectOption) => {
      data.selections = data.selections.filter(x => x.value != item.value);
    }
    const changeEvent = (e:any) => {
      let selected = Array.prototype.slice.call(e.target.children).find((x:any) => x.selected == true);
      if(selected)
        dropdownModel.value = +selected.value;
      if(data.dropdownOptions.find(x => x.value == selected.value)){
        if(!props.isMulti) {
          data.dropdownText = (data.dropdownOptions.find(x => x.value == selected.value) as ISelectOption).text;
        }
        else {
          const option = data.dropdownOptions.find(x => x.value == selected.value) as ISelectOption
          data.selections.push(option);
        }
      }
      else  {
        data.dropdownText = props.placeholder || "Select"
      }
    
      data.active = false;
    }

    const isSelected = (item:any) => {
      return props.defaultValue === item.value;
    }
    return {isSelected, changeEvent, removeItem, toggleOpen,dropdownModel, showMultiSelect, ...toRefs(data)}
  },
  props: {
    label: String,
    placeholder: String,
    field : FormField, //any
    items : Array as () => ISelectOption[],
    isMulti: Boolean,
    defaultValue: String
  }

})
</script>

<style lang="stylus">
  .input-field.select
    &.active 
      label
        color $text-color-highlight !important
      .select-dropdown
        color $text-color-highlight !important
    
</style>
