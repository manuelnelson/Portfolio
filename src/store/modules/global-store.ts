import {reactive,computed} from 'vue'
import { IStore } from '..';
import { modalStore } from './modal-store';
import { Slide } from '../types/slide';

const filePath = '/images'

class GlobalStore implements IStore{
  state = reactive({
    disableShortcuts: false,
    shouldUseLocalStorage: false,
    menuIsOpen: false,
    isLoading: false,
    slides: [
    {
        id: "small-beans",
        title: "Small Beans",
        subTitle: "Personal Productivity Tracker",
        imageOne: `${filePath}/small-beans.png`,
        imageTwo: `${filePath}/small-beans-2.png`,
        role: "Developer",
        link: "https://smallbeans.app",
        tools: ["Vue 3", "Postgres","Redis", "Nestjs", "Typescript"],
        description: "Personal Project to help me stay focused and track my productivity.  Also first project to use Vue 3."
    },
    {
      id: "piano-pal",
      title: "Piano Pal",
      subTitle: "Piano Learning Tool",
      imageOne: `${filePath}/pianopal.png`,
      imageTwo: `${filePath}/pianopal-2.png`,
      role: "Developer",
      link: "https://pianopal.app",
      tools: ["Vue 3", "Postgres","Redis", "Nestjs", "Typescript"],
      description: "Piano learning tool based on gamifying learning similar to Rock Band. Hook up Midi Keyboard to your phone or tablet to play along!"
  },
  {
      id: "youth-indicators",
      title: "U.N. Youth Indicators Application",
      subTitle: "Made in accordance with United Nations OSGEY",
      imageOne: `${filePath}/youth-indicators.png`,
      imageTwo: `${filePath}/youth-indicators-2.png`,
      role: "Architect, Designer, Developer",
      link: "https://youthindicators.herokuapp.com",
      tools: ["Vuejs/Nuxtjs", "UN Stats API", "MongoDB backend"],
      description: "Entire project designed and developed by myself with guidance from UN OSGEY"
    },
    {
      id: "one-north",
      title: "One North Interactive Websites",
      subTitle: "Made for One North",
      imageOne: `${filePath}/burnsmcd.png`,
      imageTwo: `${filePath}/onenorth.png`,
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