import {reactive,computed} from 'vue'
import { IStore } from '..';
import { modalStore } from './modal-store';
import { Slide } from '../types/slide';

class GlobalStore implements IStore{
  state = reactive({
    disableShortcuts: false,
    shouldUseLocalStorage: false,
    menuIsOpen: false,
    isLoading: false,
    slides: [{
      id: "youth-indicators",
      title: "U.N. Youth Indicators Application",
      subTitle: "Made in accordance with United Nations OSGEY",
      imageOne: '/src/assets/images/youth-indicators.png',
      imageTwo: '/src/assets/images/youth-indicators-2.png',
      role: "Architect, Designer, Developer",
      link: "https://youthindicators.herokuapp.com",
      tools: ["Vuejs/Nuxtjs", "UN Stats API", "MongoDB backend"],
      description: "Entire project designed and developed by myself with guidance from UN OSGEY"
    }, {
      id: "united-nations",
      title: "UN Foundation - APIHighways",
      subTitle: "Made in accordance with Global Partnership for Sustainable Development Data",
      imageOne: '/src/assets/images/api-highways.png',
      imageTwo: '/src/assets/images/api-highways-2.png',
      role: "Developer",
      link: "https://apihighways.org",
      tools: ["Vuejs", "Microservice Architecture","Kubernetes", "MongoDB backend"],
      description: "Project originally started by Vizzuality, I took over as a solo developer to add new features and fix bugs"
    },
    {
      id: "one-north",
      title: "One North Interactive Websites",
      subTitle: "Made for One North",
      imageOne: '/src/assets/images/burnsmcd.png',
      imageTwo: '/src/assets/images/onenorth.png',
      links: [{url:"https://onenorth.com", text:"One North"},{url:"https://burnsmcd.com", text:"Burns McDonell"},{url:"https://taftlaw.com", text:"Taft Law"},{url:"https://plantemoran.com", text:"Plante Moran Website"}, {url:"https://torys.com", text:"Torys Website"}],
      role: "Senior Developer",
      tools: ["Vuejs/Angular", "Sitecore", "KeystoneJs", ".NET", "Azure"],
      description: "A sampling of projects developed entirely on my own (design and strategy not my own), other times on a team of developers.  Front-end and Back-end development"
    }] as Slide[]


  })

  isDisabled = computed(() => {
    return this.state.disableShortcuts || modalStore.anyActive.value;
  })
}

const globalStore = new GlobalStore();

export {globalStore};