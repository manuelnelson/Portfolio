<template>
  <div class="project slide" :id="slide.id" ref="slideRef">
   <h2 class="slide__title">{{slide.title}}</h2>
   <span class="slide__sub-title">{{slide.subTitle}}</span>
   <div class="slide__images"> 
     <div class="left">
      <img class="gs" :src="slide.imageOne" alt="youth indicators" />
     </div>
     <div class="right">
      <img class="gs" :src="slide.imageTwo" alt="youth indicators" />
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
import {Slide} from '../store/types/slide';
import { defineComponent, ref, computed, reactive, toRefs, onMounted, SetupContext } from 'vue';
import { globalStore } from '../store';

class SlideComponent {
  slide?: Slide
}

export default defineComponent({
  props: {
    slide: Object,
  },
  setup(props:SlideComponent) {
    onMounted(() => {
      if(props && props.slide != null) {
        let globalSlide = globalStore.state.slides.find(x => x.id == (props.slide as Slide).id);
        if(globalSlide)
          globalSlide.offsetTop = (slideRef.value as HTMLElement).offsetTop;
      }
    })
    const slideRef = ref(undefined as undefined | HTMLElement);

    const data = reactive({
      slide: props.slide
    })
    
    return {
      ...toRefs(data), slideRef
    }
  }
});


// export default class YouthIndicators extends Vue {
//   @Prop() slide?: Slide

//   mounted() {
//     if(this.slide && this.slide.id) {
//       //console.log(this.$refs[this.slide.id])
//       this.slide.offsetTop = (this.$refs[this.slide.id] as HTMLElement).offsetTop;
//       //debugger;
//     }
//   }
// }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
</style>
