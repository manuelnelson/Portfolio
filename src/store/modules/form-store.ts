import {reactive, computed} from 'vue'
import { IStore } from '..';
import { Validate } from '../../services/validate-service';

class FormStore implements IStore{
  state = reactive({
    // metadataMidiModel: new MidiDto(),
    ///validators
    // metadataMidiValidator: {} as Validate,
  })
  setState(name:string, value:any) {
    this.state[name] = value;
  }
  getState(name:string) {
    switch(name) {
      // case 'metadataMidiModel':
      //   return this.state.metadataMidiModel
      // case 'metadataMidiValidator':
      //   return this.state.metadataMidiValidator
    }
  }

}

const formStore = new FormStore();

export {formStore};