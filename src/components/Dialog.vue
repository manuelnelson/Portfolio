
<template>
  <div>
    <div :id="modalId" class="modal dialog" :class="{'open': openModal}" :style="{top: `${topPercent}%`}">
      <div class="dialog-close" @click.stop="cancel"><i class="material-icons">close</i></div>
      <div class="modal-content">
        <p v-if="title && title.length > 0" class="title">{{title}}</p>
        <slot name="content"></slot>
      </div>
      <div class="modal-footer" v-if="!noFooter">
         <slot name="footer"></slot>
      </div>
    </div>
    <div class="modal-overlay" :class="{'open': openModal}" @click.stop="cancel"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed, watch, ComputedRef, onMounted } from "vue"
import { modalStore } from "../store/modules/modal-store";
interface ModalProps {
    title?: string, 
    modalId?: string,
    isOpen?: boolean, //this is the flag that opens/closes the modal
    dialogModel?:Object,
    noFooter?: Boolean,
    top?: number,
    cancelAction?: Function,
    openAction?: Function
}

export default defineComponent({
  props: {
    title: String, 
    modalId: String,
    isOpen: Boolean,
    dialogModel:Object,
    noFooter: Boolean,
    top: Number,
    cancelAction: Function,
    openAction: Function
  }, 
  setup(props:ModalProps) {
    onMounted(() => {
      if(props.modalId && props.top){
        data.topPercent  = props.top || 20;
      }

    })
    const data = reactive({
      topPercent: 20,
      openModal: props.isOpen
    })

    watch(() => props.isOpen, (newValue) => {
      data.openModal = newValue;
      console.log("setup -> newValue", newValue)
      if(newValue && props.openAction) {
        props.openAction();
      }
      if(!newValue && props.cancelAction) {
        props.cancelAction();
      }
    })
    const cancel = () => {
      modalStore.state[props.modalId] = false;
    }
    return {...toRefs(data), cancel}
  }
})
</script>

<style lang="stylus">
@import "../assets/main.styl";
.dialog
  background-color var(--background-color) !important
  color var(--text-color);
  overflow visible !important
  &-close
    float right
    padding 10px
    cursor pointer
  .rich-text:first-child
    margin-top 0
  .btn
    +.btn
      margin-left 10px;
      margin-right 10px;
  .title 
    display block
    font-size px-to-rem(24px)
    font-weight bold
    margin-bottom 4px
    padding-bottom 0 
  .modal-content 
    overflow visible !important
    min-height px-to-rem(100px)
  .modal-footer
    display flex
    justify-content flex-end
    // background-color var(--background-color)
    color white;
    height auto !important
    padding 0 24px 24px !important;

+for_breakpoint(sm xs)
  .dialog.modal
    width 90%;
    height: 90vh;
    max-height: 90vh !important;  
    top: 5vh !important;

</style>
