import { computed } from "vue"
import { userStore } from "../store/modules/user-store"
import { authStore } from "../store"


const user = computed(() => {
  return userStore.state.activeUser
})
const isLoggedIn = computed(() => {
  return authStore.isLoggedIn.value
})
const isAdmin = computed(() => {
  return authStore.userId && authStore.userId.value == 9
})
export { user, isAdmin, isLoggedIn}