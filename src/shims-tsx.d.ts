import Vue, { VNode } from 'vue';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    // interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
  

  interface ImportMeta {
    env: {
      VITE_API_URL: string,
      VUE_APP_AWS_BUCKET_NAME: string,
      VITE_CORDOVA: boolean,
      MODE: string
    }
  }
  var mui :any 
  var M :any 
}

