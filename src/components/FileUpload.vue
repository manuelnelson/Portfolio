<template>
  <div class="upload" :class="classes">
    <slot></slot>
    <i @click.stop="onDelete" v-if="onDelete && existingPhoto" class="material-icons text-black absolute top-0 z-10 right-0 quartiery rounded">close</i>
    <div class="upload-area" :class="{'is-loading': processing}" @click.stop="triggerBrowse">
      <form :style="formStyles" ref="uploadForm">
            <input
              type="file"
              ref="hiddenFileInput"
              :multiple="multiple"
              accept="mid/*"
              @change="onFileInputChange"
            />
      </form>
    </div>
  </div>

</template>
<script lang="ts"> 
import { filesService } from '../services/file.service'
// import axios from 'axios';
import alertStore from '../store/modules/alert-store';
import {fileStore} from '../store/modules/file-store';
import { FileDto } from '../store/entities/file-dto';
import { AlertType, Alert } from '../store/entities/alert';
import { defineComponent, reactive, computed, ref, toRefs } from 'vue';
import { apiService } from '../services';
const bucketName = import.meta.env.VITE_APP_AWS_BUCKET_NAME;
export default defineComponent({
  props: {
    parentId:String,
    altText:String,
    classList:String,
    allowedExtensions: String,
    multiple: Boolean,
    onUploadComplete: Function,
    folder: String,
    onDelete:Function,
    existingPhoto: Boolean
  },
  setup(props, context) {
    //lifecycle hooks

    //data
    const hiddenFileInput = ref(null); //https://vuedose.tips/access-template-refs-in-composition-api-in-vuejs-3/

    const data = reactive({
      files: [] as string[],
      url: '',
      processing: false,
      formStyles: {
        visibility: "hidden !important",
        position: "absolute !important",
        top: "0 !important",
        left: "0 !important",
        height: "0px !important",
        width: "0px !important",
      }
    })

    //computed
    const parent = computed(() => props.parentId) 
    const inputEl = computed(() : HTMLInputElement | null => {
      let el = hiddenFileInput.value;
      if (!(el instanceof HTMLInputElement)) {
        return null;
      }
      return el;
      
    })
    const classes = computed(() => {
      return props.classList && props.existingPhoto ? props.classList + ' existing-photo' : (props.classList ? props.classList : '');
    })
    //methods
    const getFile = () => {
      return data.files && data.files.length > 0 ? data.files[0] : null;
    }
    const uploadPhotos = async () : Promise<FileDto[] | undefined>  => {
      let photos = new Array<Promise<FileDto>>()
      for(var i = 0; i < data.files.length;i++) {
        let photo = new FileDto({
          url: data.files[i],
          alt: props.altText
        });
        photos.push(fileStore.add(photo))
      }
      if(photos.length > 0)
        return await Promise.all(photos);
    }

    const onFileInputChange = async () => {
      data.processing = true;
      const addedFile = ((inputEl.value as HTMLInputElement).files as FileList)[0];
      
      let extension = addedFile.name.split('.').length > 1 ? addedFile.name.split('.')[1] : "";
      if(props.allowedExtensions && props.allowedExtensions.indexOf(extension.trim().toLowerCase()) < 0) {
        alertStore.addAlert(new Alert({
          id:0,
          message: `Uploaded file must be of type ${props.allowedExtensions}`,
          type: AlertType.Warning
        }));
        data.processing = false;
        return;
      }
      const fileName = parent.value ? `${parent.value}_${new Date().getTime()}.${extension}` : `${new Date().getTime()}.${extension}`;
      let s3 = await filesService.getSignature(props.folder as string, encodeURIComponent(fileName), encodeURIComponent(addedFile.type));
      if(!s3) {
        alertStore.addSimpleAlert("Unable to upload file")
        return;
      }
      data.url = s3.s3url;
      let options = {
        method: 'put',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': addedFile.type,
        }
      }
      await apiService.put(s3.s3url, addedFile, options);
      if(props.multiple)
        data.files.push(`https://s3-us-east-2.amazonaws.com/${bucketName}/${props.folder}/${fileName}`)
      else {
        data.files.pop();
        data.files.push(`https://s3-us-east-2.amazonaws.com/${bucketName}/${props.folder}/${fileName}`)      
      }
      let files = await uploadPhotos()
      if(props.onUploadComplete)
        props.onUploadComplete(files);
      data.processing = false;
    }
    //https://codesandbox.io/s/lyzqn4m659
    const triggerBrowse = () => {    
      (inputEl.value as HTMLInputElement).click();
    }
    return {...toRefs(data),hiddenFileInput, triggerBrowse, parent, inputEl, onFileInputChange,uploadPhotos,getFile}
  },
})
</script>

<style lang="stylus">
@import "../assets/main.styl";
  .upload
    position relative
    i 
      display none
    &:hover
      i 
        display block
        cursor pointer
    &-area 
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      cursor pointer
      &.is-loading 
        cursor spin;
        &:before 
          content: 'Uploading...'


</style>
