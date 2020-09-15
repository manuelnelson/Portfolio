<template>
  <header @click.stop="doNothing">
    <nav class="nav show-header z-depth-1"  :class="{'unpinned':!isPinned}"> 
      <div class="nav__items">
        <div class="nav__items-left">
          <router-link class="logo" to="/">
            <i class="material-icons logo-icon">queue_music</i> 
            <span class="title">Your New App :)</span> 
          </router-link>
        </div>
        <div class="nav__items-right"> 
          <button title="login/account" @click.stop="showLoginDialog" class="nav__menu icon-account primary--text"><i class="material-icons ">account_box</i></button>
          <button title="menu" class="nav__menu text-color" @click.stop="openMenu"><i class="material-icons">menu</i></button>
        </div>
      </div>
    </nav>
    <!-- <menu-component></menu-component> -->
    <login-component></login-component> 
    <section :class="{'open':menuIsOpen}" class="menu fixed h-full top-0 right-0 w-full md:w-1/2 lg:w-1/3 z-depth-4">
      <button title="menu" class="fixed top-0 right-0 p-3 btn-large btn-secondary" @click.stop="closeMenu"><i class="material-icons">close</i></button>
      <div class="menu__links m-10 p-10">
        <ul class=" text-center font-bold flex flex-col no-style text-4xl">  
          <!-- <router-link v-if="!authStore.isLoggedIn.value" to="/login">Login</router-link> -->
          <li><router-link class="mb-3 fancy" :to="routes.home.path"><i class="material-icons">home</i></router-link></li>
          <li><router-link class="mb-3 fancy" :to="routes.about.path">About</router-link></li>
        </ul>
      </div>
    </section>
  </header>
</template> 
<script lang="ts"> 
import {defineComponent, ref, onMounted, reactive, toRefs, onUnmounted, computed} from "vue";
import LoginComponent from './Forms/Login.vue'
import { authStore, modalStore, globalStore } from "../store";
import router, { routes } from "../router";
export default defineComponent({ 
  components: {LoginComponent},
  setup() {
    const limitPosition = 40;
    let lastPosition = 0;
    //lifecycle
    onMounted(() => {
      window.addEventListener('scroll',handleScroll)
    })
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    })
    //data
    const data = reactive({
      isPinned:true,
    })
    //computed
    const menuIsOpen = computed(() => {
      return globalStore.state.menuIsOpen
    })
    //methods
    //this method prevents the menu from closing when clicked inside.
    const doNothing = () => {

    }
    const openMenu = () => {
      globalStore.state.menuIsOpen = true;
    }
    const closeMenu = () => {
      globalStore.state.menuIsOpen = false;
    }
    const handleScroll = (ev:Event) => {
        // window.scrollY
        if(window.scrollY > lastPosition && window.scrollY > limitPosition){
          data.isPinned = false;
        } else {
          data.isPinned = true;
        }
        lastPosition = window.scrollY;
    }
    const showLoginDialog = () => {
      if(authStore.isLoggedIn.value) {
        //todo go to user setting page instead
        router.push(routes.profile.path);
        return;
      } 
      modalStore.state.login = true;
    }
    return {showLoginDialog, ...toRefs(data), menuIsOpen, openMenu, closeMenu, routes, doNothing};
  }
}) 
</script>

<style lang="stylus">
@import "../assets/main.styl";

header
  .nav 
    background-color var(--navigation-background)
    position fixed 
    top 0
    left 0; 
    width 100%;
    z-index 20 
    display flex;
    justify-content space-between;
    box-sizing border-box
    will-change: transform;
    transition: transform 200ms linear;
    transform: translateY(0%);
    &.unpinned
      transform: translateY(-100%);
    &__menu 
      display inline-block; 
      outline none;
      border none;        
      // color var(--text-color);  
      cursor pointer
      i.material-icons 
        font-size px-to-rem(44px)
    // .icon-account
    //   color var(--primary) 
    .logo 
      cursor pointer
      text-decoration: none;
      display flex;
      align-items center;
      height 100%;
      .title 
        font-size px-to-rem(40px); 
        color var(--text-color);  
        margin-right px-to-rem(8px);
        position relative 
        line-height 1.5
      &-icon 
        font-size px-to-rem(50px);
        color var(--primary);
        position relative
        height auto; 
        margin-right px-to-rem(8px);
        line-height 1.5
        display inline
      &:after 
        display:none;
      &:hover 
        &:after 
          display:none;
    &__items 
      display flex
      align-items center;
      width 100%;
      justify-content space-between
      &-left 
        padding 0 px-to-rem(15px) 0 px-to-rem(30px)
        height 100%;
        box-sizing border-box 
        width 100%;
      &-right 
        padding px-to-rem(3px) px-to-rem(15px) px-to-rem(3px) px-to-rem(15px)
        height 100%;
        box-sizing border-box
        text-align right;
        display flex;
        width 400px
        align-items center
        justify-content flex-end
    a
      font-weight bold
      color var(--navigation-background);
      margin-right px-to-rem(20px);
      display inline-block
      i.materical-icons 
        font-size 24px !important;
      &.router-link-exact-active 
        color var(--text-color);  

  .menu 
    background-color var(--dark-color) 
    z-index 21
    will-change: transform;
    transition: transform 200ms linear;
    transform: translateX(100%);
    &.open
      transform: translateX(0%);

  +for_breakpoint(xs) 
    .nav 
      .logo 
        img 
          max-height 24px;
      &__items 
        justify-content space-between;
        width 100%;
        &-desktop 
          display none !important;
        &-left 
          padding-left 10px;
        &-right 
          padding-right 10px;
          width auto
      &__menu 
        display inline-block;
        background-color transparent;
        outline none;
        border none;        
        color var(--text-color);  
      .btn 
        display none;

</style>
