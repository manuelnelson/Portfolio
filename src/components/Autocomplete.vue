<template>
  <div class="input-field">
    <i class="material-icons prefix" v-if="field.prefix">{{field.prefix}}</i>
    <input type="text" :value="autocompleteModel" :name="field.name"  @input="e => autocompleteModel = e.target.value"  @focus="isFocused = true" @keydown.enter="hey" @keyup.stop="filterItems" autocomplete="new-password" id="autocomplete-input" class="autocomplete-field" :required="field.isRequired"/>
    <label :class="{'active': autocompleteModel.length > 0}">{{label}}</label>
    <ul class="autocomplete-content dropdown-content" :class="{'active':showDropDown}" tabindex="0"> 
      <li v-for="(item,ndx) in filteredOptions" :class="{'active':activeIndex == ndx}" @click.stop="selectItem(item)" :key="item.value">{{item.text}}</li>
    </ul>
     <div class="selected-autocomplete-items" v-if="field.type == 4">
      <span class="btn mt-4" :key="item.id" @click.stop="removeAutoListItem(item)" v-for="item in autoCompleteList">
        {{item.text}}
        <i class="material-icons">close</i>
      </span>
    </div> 
  </div> 
</template>
<script lang="ts">
import { ISelectOption, FormField } from '../store/entities/form-entity';
import { defineComponent, ref, reactive, computed, ComputedRef, onMounted, watch, toRefs } from 'vue';
import { formStore } from '../store/modules/form-store';

interface AutocompleteProps {
    label?: String
    placeholder?: String
    field?: FormField
    model?: any
    items?: Array<ISelectOption>,
    isMulti?: Boolean
    required?: Boolean
    defaultValue?: string
    selectedHandler?: Function
    removedHandler?: Function
}

export default defineComponent({
  props:  {
    label: String,
    placeholder: String,
    field: FormField,
    model: Object,
    items : Array as () => ISelectOption[],
    isMulti: Boolean,
    required: Boolean,
    defaultValue: String,
    selectedHandler: Function,
    removedHandler: Function
  },
  setup(props:AutocompleteProps) {
    onMounted(() => {
      data.options = props.items ? props.items : [];
    })
    const data = reactive({
      autocompleteModel: '',
      options: [] as ISelectOption[],
      filteredOptions: [] as ISelectOption[],
      activeIndex: -1,
      autoCompleteList: [] as Array<any>,
      isFocused: false
    })
    const showDropDown : ComputedRef<boolean> = computed(() =>{
      return data.filteredOptions.length > 0 && data.isFocused && data.autocompleteModel.length > 0
    })
    watch(() => props.items, (newValue:ISelectOption[] | undefined) => {
      data.options = newValue ? newValue : []
    })
    watch(() => props.defaultValue, (newValue) => {
      data.autocompleteModel = newValue as string;
      // if(newValue && newValue != data.autocompleteModel)
    })

    const selectItem = (item:ISelectOption) => {
      if(props.isMulti) {
        selectMultiHandler(item);
        return;
      }
      data.autocompleteModel = item.text;
      if(props.model && props.field) {
        props.model[props.field.name as string] = item.text;
      }
      data.filteredOptions = [];
    }
    const filterItems = (e:KeyboardEvent) => {
      //update model as well
      // if(props.model && props.field)
      //   props.model[props.field.name] = data.autocompleteModel
      data.filteredOptions = data.options.filter(x => x.text.toLowerCase().indexOf((data.autocompleteModel as string).toLowerCase()) > -1).slice(0,5);
      if(e.keyCode == 13) {
        //enter key...handle with keys below in a min
        e.preventDefault();
        selectItem(data.filteredOptions[data.activeIndex])
      }
      //up and down keys
      if(e.keyCode == 38  || e.keyCode == 40) {
        e.preventDefault();
        if(e.keyCode == 38 && data.activeIndex > -1) {
          data.activeIndex--;
        }
        if(e.keyCode === 40 && data.activeIndex < data.filteredOptions.length - 1) {
          data.activeIndex++;
        }
      }
    }
    const hey = (e:KeyboardEvent) => {
      if(data.filteredOptions.length > 0)
        e.preventDefault()
    }
    //autocomlete functions
    const selectMultiHandler = (item:ISelectOption) => {
      if(props.selectedHandler)
        props.selectedHandler(item);
      data.autoCompleteList.push(item);
      data.autocompleteModel = '';
    }
    const removeAutoListItem = (item:ISelectOption) => {
      if(props.removedHandler)
        props.removedHandler(item)
      data.autoCompleteList = data.autoCompleteList.filter(x => x.value != item.value)
    }
    return {hey, filterItems, selectItem, ...toRefs(data), showDropDown, removeAutoListItem, selectMultiHandler}
  }
})
</script>
<style lang="stylus">
  @import "../assets/main.styl";

  .autocomplete-content.dropdown-content.active 
    display: block;
    transform: scaleX(1) scaleY(1);
    opacity 1;
    width 100%;
    left: 0;
    top: 48px;
    li 
      color: black;
  .selected-autocomplete-items 
      span 
        display inline-flex
        background-color var(--primary)
        cursor pointer;
        margin-right 6px !important
        margin-left 0px !important 
        margin-bottom 6px;
        &:hover
          i
            color white !important
        i 
          margin-left 6px;
          color $primary !important
</style>