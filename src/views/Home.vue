<template>
  <div class="home" :class="{'loaded': loaded, 'compressed': compressed}">
    <div class="left-panel" >
      <h1 class="name"><span class="first-name">E</span><span class="last-name">N</span></h1>
      <img class="home-image" alt="Main Image" src="/src/assets/images/black-and-white.jpg" />
      <ul class="social-links">
        <li><a class="social-links_link" target="_blank" href="https://github.com/manuelnelson/">Github</a></li>
        <li><a class="social-links_link" target="_blank" href="https://www.linkedin.com/in/emmanuelnelson/">LinkedIn</a></li>
        <li><a class="social-links_link" target="_blank" href="https://twitter.com/manuelnelson">Twitter</a></li>
      </ul>
    </div>
    <div class="right-panel" v-on:scroll="handleScroll" ref="rightSideRef">
      <div class="small-about slide" id="about">
        <p>I build and create things. </p><br><p> Mainly websites. Some mobile apps. Data visualizations. Gardens. Music. Wood crafts. But I primarily concern myself with digital creations.</p><br>
        <p>Front-end (Primarily Vuejs these days), Node, and .NET are my areas of expertise.</p>
        <div class="small-about__next" >
          <button @click="scrollTo(scrollLinks[1])">View projects </button><br>
          <i @click="scrollTo(scrollLinks[1])" tabindex="0" role="button" class="material-icons">arrow_downward</i>
        </div>
      </div>
      <slide-component v-for="(slide,ndx) in slides" :key="ndx" :slide="slide"></slide-component>
      <div class="project slide" id="contact" ref="contactRef">
        <h2 class="slide__title">Contact</h2>
        <div class="slide__contact">
          <p>If you need software development help and would like to contact me, please contact me at:</p>
          <a href="mailto:info@emmanuelnelson.com">info@emmanuelnelson.com</a>
        </div>
      </div>   
      <div class="scroll-buttons">
        <a href="#" :aria-label="`Navigate to section ${ndx}`" :class="{'active':link.active}" v-for="(link,ndx) in scrollLinks" :key="ndx" @click="scrollTo(link)"></a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, computed, ref, reactive, onMounted, toRefs, ComputedRef, onUnmounted, onBeforeMount, watch} from "vue";

import {authStore} from '../store/modules/auth-store'; 
import router from "../router";
import { modalStore } from "../store/modules/modal-store";
import { formStore } from "../store/modules/form-store";
import { apiService } from "../services"; 
import { globalStore } from "../store/modules/global-store";
import PullToRefresh from "pulltorefreshjs";
import {Slide} from '../store/types/slide'
import { user } from "../helpers/user-helper";
import { userStore } from "../store";
import alertStore from "../store/modules/alert-store";
import SlideComponent from '../components/Slide.vue';
export default defineComponent({
  components: {SlideComponent},
  setup(props, context) {
    //life-cycle hooks
    onBeforeMount(() => {
      alertStore.clearAlerts();
    })
    onMounted(async () => {
      setTimeout(() => {
        data.loaded = true
      }, 20)
    })

    //configure data
    const data = reactive({
      loaded:false,
      compressed: false,
      prevScrollTop: 0,
      cancelScroll:false,
      options: {
        container: '.right-panel',
        offset: -80
      },
      scrollLinks:  [
        {
          id: "about",
          active: true,
          collapse: true
        },
        {
          id: "youth-indicators",
          active: false,
          collapse: false
        },
        {
          id: "united-nations",
          active: false,
          collapse: false
        },
        {
          id: "one-north",
          active: false,
          collapse: false
        },
        {
          id: "contact",
          active: false,
          collapse: false
        },
      ],
    });
    const contactRef = ref(undefined as undefined | HTMLElement);
    const rightSideRef = ref(undefined as undefined | HTMLElement);
    const isLoading = computed(() => {
      return globalStore.state.isLoading;
    })
    const slides : ComputedRef<Array<Slide>> = computed(() => {
      return globalStore.state.slides;
    })
    const getActiveScrollNdx = () => {
      return data.scrollLinks.findIndex(x => x.active)
    }
    const clearActiveScroll = () => {
      data.scrollLinks.forEach(element => {
        element.active = false;
      });
    }
    const scrollTo = (link:any) => {
      if(data.cancelScroll)
        return
      data.cancelScroll = true;
      data.compressed = !link.collapse;  
      let slide = globalStore.state.slides.find(x => x && x.id == link.id);
      if(slide && slide.offsetTop){
        (rightSideRef.value as HTMLElement).scrollTo({
          top: (slide.offsetTop - 80),
          left: 0,
          behavior: 'smooth'
        })
      }
      // VueScrollTo.scrollTo(link.id,500,this.options);
      setTimeout(() => {
        data.cancelScroll = false
      },900)
    }
    const handleScroll = (e:any) => {
    let ndx = getActiveScrollNdx();
    let activeSlide = slides.value[ndx]; 
    const offset = 100;
    if(ndx != data.scrollLinks.length - 1) {
      if(activeSlide && activeSlide.offsetTop) {
        if(e.target.scrollTop > (activeSlide.offsetTop - offset)) {
          clearActiveScroll();
          data.scrollLinks[ndx+1].active = true;
          return;
        }
      } else {
        if(e.target.scrollTop > ((contactRef.value as HTMLElement).offsetTop - offset)) {
          clearActiveScroll();
          data.scrollLinks[ndx+1].active = true;
          return;
        }
      }
    }
    if(ndx != 0) {
      let prevSlide = slides.value[ndx-1];
      if(prevSlide && prevSlide.offsetTop && (e.target.scrollTop < (prevSlide.offsetTop - offset))) {
        clearActiveScroll();
        data.scrollLinks[ndx-1].active = true; 
      }
      else if(!prevSlide) {
        prevSlide = (contactRef.value as HTMLElement)
        if(prevSlide && prevSlide.offsetTop && (e.target.scrollTop < (prevSlide.offsetTop - offset))) {
          clearActiveScroll();
          data.scrollLinks[ndx-1].active = true; 
        }
      }
    }
    let offsetTop = (slides.value[0].offsetTop as number) - offset;
    if(!data.compressed && e.target.scrollTop > 40) {
      scrollTo(data.scrollLinks[1]);
    }
    if(data.compressed && e.target.scrollTop < 40) {
      // (rightSideRef.value as HTMLElement).scrollTo({
      //   top: offsetTop,
      //   left: 0,
      //   behavior: 'smooth'
      // })
      data.compressed = false;
    }
  }
    //methods
    return {
        ...toRefs(data), isLoading, handleScroll, clearActiveScroll, getActiveScrollNdx, contactRef, rightSideRef, slides, scrollTo
    };
  },
}) 
</script>
<style lang="stylus">
@import "../assets/main.styl";
 .home 
    height  100vh
    width 100%
    display flex
    align-content center;
    overflow hidden
    .social-links
      display none
    &-image 
      width 300px;
      border-radius 140px
      margin-top 40px 
      opacity 0
      transition opacity 1s ease-in-out 0.4s, max-width  0.6s ease-in-out;
      max-width 300px
    .left-panel
      width 50%;
      max-width 50%
      position relative
      left 0;
      top 0;
      border-right  solid 1px $light-gray
      margin-top 10vh
      height: 80%;
      padding-top 40px
      transition max-width 0.6s ease-in-out
    .right-panel
      width 100%;
      max-width 50%
      padding: 140px 80px 80px;  
      position relative;
      scroll-behavior: smooth;
      transition max-width 0.6s ease-in-out
      overflow auto
  &.loaded
    .home-image
        opacity 1  
  
  $max-width = 120px;
  &.compressed
    .left-panel
      max-width $max-width;
    .right-panel      
      max-width 'calc(100% - %s)' % $max-width;
      //width 'calc(100% - %s)' % $max-width;
    .home-image
      opacity 0
      max-width 0
    .social-links
      display flex
      flex-direction column
      position absolute
      bottom 80px
      width 100%
      justify-content center
      &_link
        text-decoration none;
        margin-top 10px    
        position  relative    
        display: inline-block;
        &:after
          content: '';
          position absolute
          display: block
          left  50%;
          transform translateX(-50%)
          width: 0px
          height: 1.5px;
          background-color: black;
          transition width 0.3s ease-in-out
        &:hover
          &:after
            width 100%



  .small-about  
    width 100%
    font-size px-to-rem(28px)
    line-height 1.4
    &__next
      margin-top 80px
      cursor pointer
      button
        font-family $font-writing
        font-size px-to-rem(24px)
      i 
        position relative
        top 0
        transition top 0.3s ease-in-out
      &:hover
        i 
          top 20px

+for_breakpoint(sm) 
  .home
    $max-width = 40px;
    .right-panel
      padding: 140px ($max-width / 2) 80px;  

    &.compressed 
      .left-panel
        max-width $max-width * 2;
      .right-panel      
        max-width 'calc(100% - %s)' % ($max-width / 2);
        width 'calc(100% - %s)' % ($max-width / 2);
+for_breakpoint(xs)
  .home
    display block
    overflow auto;
    .left-panel
      width 100%
      max-width 100%
      height  auto
      padding 40px 30px 0
    .right-panel
      width 100%
      max-width 100%
      padding 140px 30px 80px
    &-image 
      max-width 55%;
    .small-about  
      font-size px-to-rem(22px)
      &__next
        display none;
    .social-links
      display block
      position  relative
      margin-top  80px;
      &_link
        margin-top 0
        //margin-right  10px;
        display block
    
</style>
