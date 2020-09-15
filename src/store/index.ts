import AlertStore from "./modules/alert-store";
import {authStore} from "./modules/auth-store";
import {fileStore} from "./modules/file-store";
import {formStore} from "./modules/form-store";
import {globalStore} from "./modules/global-store";
import {modalStore} from "./modules/modal-store";
import {userStore} from "./modules/user-store";
export interface IStore {
  state: any
}

export {AlertStore,authStore,fileStore,formStore,globalStore,modalStore,userStore}