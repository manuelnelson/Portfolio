import { getAssetPath } from "../helpers/asset-helper";
import {Slide} from '../models/slide'
import { ref } from 'vue';

export const slides = ref([{
    id: "piano-pal",
    title: "Piano Pal",
    subTitle: "Piano Learning Tool",
    imageOne: getAssetPath('../assets/images/pianopal.png'),
    imageTwo: getAssetPath('../assets/images/pianopal-2.png'),
    role: "Architect, Designer, Developer",
    link: "https://pianopal.app",
    tools: ["Vue 3", "Postgres","Redis", "Nestjs", "Typescript"],
    description: "Piano learning tool based on gamifying learning similar to Rock Band. Hook up Midi Keyboard to your phone or tablet to play along!"
  }, {
    id: "small-beans",
    title: "Small Beans",
    subTitle: "Personal Productivity Tracker",
    imageOne: getAssetPath('../assets/images/small-beans.png'),
    imageTwo: getAssetPath('../assets/images/small-beans-2.png'),
    role: "Developer",
    link: "https://smallbeans.app",
    tools: ["Vue 3", "Postgres","Redis", "Nestjs", "Typescript"],
    description: "Personal Project to help me stay focused and track my productivity. Also first project to use Vue 3."
  },
  {
    id: "youth-indicators",
    title: "U.N. Youth Indicators Application",
    subTitle: "Made in accordance with United Nations OSGEY",
    imageOne: getAssetPath('../assets/images/youth-indicators.png'),
    imageTwo: getAssetPath('../assets/images/youth-indicators-2.png'),
    role: "Architect, Designer, Developer",
    link: "https://youthindicators.herokuapp.com",
    tools: ["Vuejs/Nuxtjs", "UN Stats API", "MongoDB backend"],
    description: "Entire project designed and developed by myself with guidance from UN OSGEY"
  },
  {
    id: "one-north",
    title: "One North Interactive Websites",
    subTitle: "Made for One North",
    imageOne: getAssetPath('../assets/images/onenorth.png'),
    imageTwo: getAssetPath('../assets/images/burnsmcd.png'),
    links: [{url:"https://onenorth.com", text:"One North"},{url:"https://burnsmcd.com", text:"Burns McDonell"},{url:"https://taftlaw.com", text:"Taft Law"},{url:"https://plantemoran.com", text:"Plante Moran Website"}, {url:"https://torys.com", text:"Torys Website"}],
    role: "Senior Developer",
    tools: ["Vuejs/Angular", "Sitecore", "KeystoneJs", ".NET", "Azure"],
    description: "A sampling of projects developed entirely on my own (design and strategy not my own), other times on a team of developers.  Front-end and Back-end development"
  }] as  Slide[]);