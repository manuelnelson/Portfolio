import { createRouter,createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import { reactive } from 'vue';
const mainTitle = 'Emmanuel Nelson'

export const routes : IRoute =  
  {
    home:  {  
      path: '/:midiId?',
      name: 'home',
      component: () => import('./views/Home.vue'),
      meta: {
        title: `Home - ${mainTitle}`
      }
    },
    about:  {  
      path: '/about/',
      name: 'about',
      component: () => import('./views/About.vue'),
      meta: {
        title: `Music Theory - ${mainTitle}`
      }
    },
};


const routeHistory = import.meta.env.VITE_CORDOVA == "true" ? createWebHashHistory() : createWebHistory();
// const routeHistory = createWebHashHistory();
const router = createRouter({
  history: routeHistory,
  routes: Object.values(routes),
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
})

export const reactiveRouteData = reactive({
  params: {},
  query: {}
});
let metaElement: undefined | HTMLMetaElement;
router.beforeEach((to,from,next) => {  
  document.title = to.meta.title;
  if(to.meta.noindex) {
    if(!metaElement) {
      metaElement = document.createElement("meta");
      metaElement.setAttribute("name","robots");
      metaElement.setAttribute("content","noindex");
      document.head.prepend(metaElement);  
    }
  } else {
    if(metaElement)
      metaElement.remove();
  }
  next();
})
//this was a circular dependency - here to get rid of that
export default router;

export interface IRoute {
  home: RouteRecordRaw,
  about: RouteRecordRaw,
}