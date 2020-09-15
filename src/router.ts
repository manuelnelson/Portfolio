import { createRouter,createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';
import Profile from './views/Profile.vue';
import { globalStore } from './store';
const mainTitle = 'Name'


export const routes : IRoute =  
  {
    home:  {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: `Home - ${mainTitle}`
      }
    },
    about:  {
      path: '/about',
      name: 'about',
      component: About,
      meta: {
        title: `Hi 👋 - ${mainTitle}`
      }
    },
    profile:  {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {
        title: `Profile - ${mainTitle}`
      }
    },
  };


const routeHistory = import.meta.env.VITE_CORDOVA ? createWebHashHistory() : createWebHistory();
// const routeHistory = createWebHashHistory();
const router = createRouter({
  history: routeHistory,
  routes: Object.values(routes),
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
})

router.beforeEach((to,from,next) => {
  document.title = to.meta.title;
  globalStore.state.menuIsOpen = false;
  next();
})

export default router;

export interface IRoute {
  home: RouteRecordRaw,
  profile: RouteRecordRaw,
  about: RouteRecordRaw
}