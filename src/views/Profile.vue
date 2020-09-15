<template>
  <div class="profile" v-if="isLoaded"> 
    <section class="profile-area flex mt-4 items-start" v-if="user"> 
      <div class="w-1/3 pr-6">
        <file-upload :onDelete="deletePhoto" :existingPhoto="hasPhoto" allowedExtensions="jpg|png|jpeg" :altText="altText" :multiple="false" :onUploadComplete="completeUpload" folder="profile">
          <div class="profile-image no-image" v-if="!hasPhoto">
            <i class="material-icons secondary--font">account_box</i>
          </div>
          <div class="profile-image image rounded-lg" v-if="hasPhoto ">
            <img  :src="profileImage.url" :alt="profileImage.alt" />
          </div>
        </file-upload>
        <div class="profile-name mt-4">
          <h1 class="mb-1" @mouseover="showEdit = true" @mouseout="showEdit = false;"> 
            <span class="link text-color" @click="editName" v-if="userHasName && !isNameEdit">{{user.firstName}} {{user.lastName}} <i v-if="showEdit" class="material-icons ml-3">edit</i></span>
            <span class="link" @click="editName" v-if="!userHasName && !isNameEdit">Your name here <i v-if="showEdit" class="material-icons ml-3">edit</i></span>
          </h1>
          <!-- edit field for name -->
          <div class="input-field" v-show="isNameEdit" >
              <i class="material-icons prefix">emoji_people</i>
              <input type="text" ref="nameRef" @keypress.enter="saveName" aria-label="Name" @blur="saveName" v-model="name" name="name"/>
              <label :class="{'active': isActive(name)}" for="name">Name</label>
          </div>

          <p class="flex content-center"><i class="material-icons mr-2">email</i>{{user.email}}</p>
          <button class="btn btn-secondary no-text mt-6" @click="logout"><span class="inline-block">Logout</span> <i class="pl-4 material-icons">directions_run</i></button>
        </div>
      </div> 
      <div class="settings w-2/3">
        <h2>Settings</h2>
        <h4 class="mt-4">Theme</h4>
        <div class="switch mt-2 mb-8">
          <label>
            light mode
            <input v-model="user.darkMode" aria-label="dark mode" type="checkbox">
            <span class="lever"></span>
            dark mode
          </label> 
        </div>
      </div>
    </section>
  </div>      
</template>
<script lang="ts">
import {defineComponent, computed, ref, reactive, toRefs, onMounted, nextTick, onUnmounted} from "vue";
import {authStore} from '../store/modules/auth-store'; 
import router, { routes } from "../router";
import { back } from "../helpers/router-helper";
import FileUpload from "../components/FileUpload.vue";
import { isActive } from "../helpers/form-helper";
import { user } from "../helpers/user-helper";
import { userStore, fileStore } from "../store";
import { UserDto, FileDto } from "../store/entities";
import { filesService } from "../services/file.service";
export default defineComponent({
  setup() {

    //life-cycle hooks
    onMounted(async () => {
      await userStore.get(authStore.userId.value);
      data.name = `${user.value.firstName} ${user.value.lastName}`
      console.log("setup -> user.value", user.value)
      if(user.value.photoId) {
        data.profileImage = await filesService.get(user.value.photoId);
      }
      data.isLoaded = true;
    })

    onUnmounted(async () => {
      await userStore.update(user.value);
    })
    const nameRef = ref(undefined as undefined | HTMLElement)
    //configure data
    const data = reactive({
      isNameEdit: false,
      isLoaded: false,
      showEdit: false,
      showPhotoEdit: false,
      name: '',
      profileImage: undefined as undefined | FileDto
    });
    //computed methods
    const userHasName = computed(() => {
      return user.value && (user.value.firstName.length > 0 || user.value.lastName.length > 0);
    })
    const altText = computed(() => {
      return userHasName.value ? `${user.value.firstName} ${user.value.lastName} photo` : 'Profile Photo'
    })
    const hasPhoto = computed(() => {
      return data.profileImage && data.profileImage.id > 0
    })
    //methods
    const logout = async() => {
      await authStore.logout();
      router.push(routes.home.path)
    }
    const completeUpload = async(files: FileDto[]) => {
      if(files && files.length > 0) {
        data.profileImage = files[0];
        user.value.photoId = files[0].id;
        await userStore.update(user.value);
      }
    }
    const deletePhoto = async() => {
      if(data.profileImage) {
        await filesService.delete(data.profileImage.id);
        data.profileImage = undefined;
      }

    } 
    const editName = async () => {
      data.isNameEdit = true;
      await nextTick();
      (nameRef.value as HTMLElement).focus();
    }
    const saveName = async () => {
      let names = data.name.split(' ');
      if(names && names.length > 0) {
        user.value.firstName = names[0].trim();
        if(names.length > 1) {
          names.splice(0,1);
          user.value.lastName = names.join(' ').trim();
        }
        await userStore.update(user.value);
      }
      data.isNameEdit = false;
    }
    return { isActive, user, ...toRefs(data), saveName, userHasName, logout, nameRef, editName, completeUpload, hasPhoto, deletePhoto }
  },
  components: {FileUpload}
}) 
</script>
<style lang="stylus">
@import "../assets/main.styl";
.profile 
  min-height 100vh; 
  background-color var(--dark-color); 
  &-image
    position relative
    z-index 0
    img 
      max-height 300px
      margin 0 auto
      object-fit cover
      height 300px;
      width: 100%;
      object-position center
    &.no-image
      width: 177px; //fix for material icons having padding by default
      margin-left: -27px;
      i
        font-size px-to-rem(200)
        color var(--primary)
        display block !important
+for_breakpoint(xs sm) 
  .profile
    &-image
      &.no-image
        width: 150px; //fix for material icons having padding by default
        margin-left: -17px;

</style>
