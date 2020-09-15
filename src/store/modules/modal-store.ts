import {reactive, computed} from 'vue'
import { IStore } from '..';

class ModalStore implements IStore{
  state = reactive({
    datepicker: false,
    login: false,
  })
  anyActive = computed(() => {
    const keys = Object.keys(this.state);
    return keys.some(x => this.state[x]); 
  })
  clearAll() {
    let modals = Object.keys(this.state);
    modals.forEach(x => (this.state[x]) = false);
  }

}

const modalStore = new ModalStore();

export {modalStore};