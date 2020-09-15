<template>
  <div class="pt-10 text-center">
    <h1 class="mb-8 text-6xl">Hello 👋. I'm Manny</h1> 
    <div class="about flex flex-wrap   md:flex-no-wrap">
      <div class="about__image mx-auto w-full md:w-1/3 p-4">
        <img class="rounded-lg" src="../assets/images/self.jpg" alt="Emmanuel Nelson"/>
      </div> 
      <div class="rich-text about__text w-full md:w-2/3 p-4">
        <p>I build a lot of tools - a lot that I find personally beneficial.  For this one in particular, I wanted an application to help 
          me learn how to play the piano.  I wanted to to work on the desktop, as well as work on tablets that can interact directly with a keyboard.  In this way, 
          it'd be possible to learn the piano in a "rock band" manner, and keep score to see how well I can play along with songs.  More features that enable this behavior will hopefully
          be coming soon :).
        </p>
        <p>Feel free to use it and if you log in, you'll be able to request features you'd like to see -- this will most likely be a paid member feature only down the road while the main app will
          remain largely free.  
          </p>
        <p></p>
        <p>Enjoy!</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    return {}
  }
})
</script>

<style lang="stylus">
  .about
    &__image
      max-width 400px;

</style>