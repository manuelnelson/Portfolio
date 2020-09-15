import router, { routes } from "../router";
import { authStore } from "../store";

const back = () => {
  router.back();
}
const logout = () => {  
  authStore.logout();
}
const goToFocus = () => {
  router.push(routes.focus.path as string)
}
export {back, logout, goToFocus}
