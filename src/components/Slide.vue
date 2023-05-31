<template>
  <div class="project slide" :id="slide.id" ref="refName">
   <h2 class="slide__title">{{slide.title}}</h2>
   <span class="slide__sub-title">{{slide.subTitle}}</span>
   <div class="slide__images"> 
     <div class="left">
      <img class="gs" :src="slide.imageOne" :alt="slide.title" />
     </div>
     <div class="right">
      <img class="gs" :src="slide.imageTwo" :alt="slide.title" />
     </div>
     <a v-if="slide.link" class="btn-primary slide__link" target="_blank" :href="slide.link">View Site</a>
     <div class="slide__links" v-if="slide.links">
      <a v-for="(link, ndx) in slide.links" :key=ndx class="btn-primary slide__link" target="_blank" :href="link.url">{{link.text}}</a>
     </div>
   </div>
   <div class="slide__description">
     <span class="slide__role">{{slide.role}}</span>
     <p>
      <ul class="tools">
        <li v-for="(tool,ndx) in slide.tools" :key="ndx">{{tool}}</li>
      </ul>
     </p>
     <p v-html="slide.description"></p>
   </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
export default defineComponent({
  props: {
    slide: {
      type: Object,
      required: true
    } 
  },
  setup(props) {
    const refName = ref<HTMLElement | null>(null)
    onMounted(() => {
      // console.log(el);
      // let slideNdx = slides.indexOf(props.slide);
      // if(props.slide && props.slide.id) {
      //   console.log(refName.value);
      //   slides[slideNdx].offsetTop = (refName.value as HTMLElement).offsetTop;
      //   console.log(slides[slideNdx].offsetTop);
      // }
    })
    return {
      slide: props.slide
    }
  },
})
</script>

<style scoped lang="stylus">
</style>
