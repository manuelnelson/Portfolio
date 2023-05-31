<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';

  export default defineComponent({
    setup() {
      const isDark = ref(false) ;
      const toggleDark = () => {
        isDark.value = !isDark.value;
      }
      return {
        isDark,
        toggleDark
      }
    }
  })
</script>

<template>
  <div id="app" :class="{'is-dark':isDark}">
    <button class="toggle-dark" title="toggle dark mode" @click="toggleDark"><i class="material-icons">invert_colors</i></button>
    <router-view/>
  </div>
</template>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Inconsolata|Shadows+Into+Light|Material+Icons');
@import "./assets/main.styl"; 


</style>
