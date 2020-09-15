<template>
  <div id="app" :class="{'is-dark':isDark}">
    <button class="toggle-dark" title="toggle dark mode" @click="toggleDark"><i class="material-icons">invert_colors</i></button>
    <router-view/>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, nextTick, onMounted, onUnmounted, reactive, computed, toRefs, watch} from "vue";
import { apiService } from "./services/api";
import NavComponent from './components/Nav.vue';
import FooterComponent from './components/Common/Footer.vue';
import AlertComponent from './components/Alert.vue';
import { modalStore } from "./store/modules/modal-store";
import { Key } from "./store/types/keycodes";
import { globalStore } from "./store/modules/global-store";
import { UserDto } from "./store/entities/user-dto";
import { userStore, authStore } from "./store";
import { user } from "./helpers/user-helper";
import router, { routes } from "./router";

export default defineComponent({ 
  components: {NavComponent, AlertComponent, FooterComponent},
  setup() {
    //lifecycles
    onMounted(async () => {
      window.addEventListener('keyup', keyboardShortcuts);
      // await userStore.get(authStore.userId.value);
    })
    onUnmounted(() => {
      window.removeEventListener('keyup', keyboardShortcuts);
    })
    //data
    const data = reactive({
      isFullSize: true,
      isDark: false
    })
    const toggleDark = () => {
      data.isDark = !data.isDark;
    }
    //computed
    //methods
    const keyboardShortcuts = (e:KeyboardEvent) => {
      //escape can always be called to dismiss forms - regardless if deactivated
      if(e.keyCode == Key.Escape) {
        modalStore.clearAll();
        globalStore.state.menuIsOpen = false;
        globalStore.state.disableShortcuts = false;
      }
      if(globalStore.isDisabled.value)
        return;
      if(e.keyCode == Key.N) {
      }
      if(e.keyCode == Key.F) {
      }
    }
    return {keyboardShortcuts, user, ...toRefs(data), toggleDark}
  }
});
</script>

<style lang="stylus">
// @import '/assets/tailwind/main.css';

@import "/assets/main.styl"; 

html 
  background-color: $lighter-gray;
  color: $primary-dark;
  +for_breakpoint(md) {
    font-size: 15px;
  }
  +for_breakpoint(sm) {
    font-size: 14px;
  }

#app
  font-family $font-sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  &.is-dark
    background-color $primary-dark;
    color $lighter-gray;
    button,a,p, .toggle-dark
      color $lighter-gray;

.toggle-dark
  cursor pointer;
  position fixed;
  top 0;
  left calc(50% - 14px);
  z-index 10
#nav
  padding 30px
  a
    font-weight bold
    color #2c3e50
    &.router-link-exact-active
      color #42b983

</style>
