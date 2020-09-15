<template>
  <div class="login-component">
    <dialog-component title="Sign In/Register" :hide-buttons="hideDialogButtons" :isOpen="openLogin" ok-text="Send" cancel-text="Cancel" modal-id="login" ref="loginDialog" :OkAction="sendEmail">
      <template v-slot:content>
        <form @submit="sendEmail" v-if="loginStage === 0" class="login-form form-container">
          <p class="rich-text">Enter your e-mail address to log in or create an account.</p>
          <p class="error-message" v-if="showErrorMessage">Please enter valid e-mail address</p> 
          <div class="input-field">
            <i class="material-icons prefix">email</i>
            <input type="email" aria-label="email" v-model="userEmail" autocomplete="on" name="userEmail"  required />
            <label :class="{'active':userEmail.length > 0}" for="userEmail">Email</label>
          </div>
        </form>
        <loading-component v-if="loginStage == 1"></loading-component>
        <p class="rich-text" v-if="loginStage == 2"><i class="material-icons">check</i>An activation code has been sent to your e-mail.</p>
        <form @submit="sendEmail" v-if="loginStage == 3" class="login-form form-container">
          <p class="rich-text">Enter your activation code.</p>
          <p class="error-message" v-if="showErrorMessage">Validation Code is required</p> 
          <div class="input-field">
            <i class="material-icons prefix">confirmation_number</i>
            <input type="text" aria-label="validation code" v-model="userCode" autocomplete="on" name="userCode"  required />
            <label :class="{'active':userCode.length > 0}" for="userCode">Validation Code</label>
          </div>
          <p class="rich-text" v-if="loginStage == 4">You've been logged in. <i class="material-icons">check_box</i></p>
        </form>
      </template>
      <template v-slot:footer>
        <button @click.prevent="sendEmail" class="btn-default btn no-text"><i class="material-icons">send</i></button>
      </template>
    </dialog-component>
  </div>
</template>
<script lang="ts">
import AlertComponent from '../components/Alert.vue';  
import { Alert, AlertType } from '../../store/entities/alert';
import {Validate, AllValidationRules, ValidationError, ValidationRule, requiredValidator, emailValidator, zipCodeValidator} from '../../services/validate-service';
import {authStore} from '../../store/modules/auth-store';
import alertStore from '../../store/modules/alert-store'; 
import { LoginDto, LoginState } from '../../store/entities';
import DialogComponent from '../Dialog.vue'
import LoadingComponent from '../Common/Loading.vue';
import router, { routes } from '../../router';
import { defineComponent, reactive, toRefs, computed } from 'vue';
import { useRouter,useRoute } from "vue-router";
import { modalStore } from '../../store';
export default defineComponent({
  setup() {
    const data = reactive({
      userEmail: '',
      userCode: '',
      showErrorMessage: false,
      loginStage: LoginState.Initial,
      validator: new Validate(new AllValidationRules({
        'userEmail': [requiredValidator('userEmail'), emailValidator('userEmail')]
      }))
    })
    const openLogin = computed(() => {
      return modalStore.state.login
    })
    const hideDialogButtons = () => {
      return data.loginStage == LoginState.Initial || data.loginStage == LoginState.EnterCode;
    }
    const moveToCodeStage = () => {
      data.loginStage = LoginState.EnterCode;    
    }
    const sendEmail = async () => {
      if(data.loginStage === LoginState.Initial) { 
        data.showErrorMessage = false;
        if(!data.validator.isValid({userEmail:data.userEmail})){
          data.showErrorMessage = true;
          return;
        }
        data.loginStage = LoginState.LoggingIn;
        const success = await authStore.sendLoginCode(new LoginDto({email: data.userEmail, redirectUrl: router.currentRoute.value.fullPath}));
        if(!success) {
          data.loginStage = LoginState.Initial
          data.showErrorMessage = true;
          return;
        }
        data.loginStage = LoginState.CodeSent;
        setTimeout(moveToCodeStage, 5000)
      } else {
        if(data.userCode.length == 0) {
          data.showErrorMessage = true;
          return;
        }
        data.loginStage = LoginState.LoggingIn;
        const success = await authStore.login(new LoginDto({email: data.userEmail, redirectUrl: router.currentRoute.value.fullPath, validationCode: data.userCode}));
        if(!success) {
          data.loginStage = LoginState.EnterCode;
          data.showErrorMessage = true;
          return;
        }
        data.loginStage = LoginState.LoggedIn;
        setTimeout(() => window.location.reload(), 1000);
      }
    }
    return {...toRefs(data),hideDialogButtons,moveToCodeStage, sendEmail, openLogin}
  },
  components: {
    LoadingComponent, DialogComponent
  },
})
</script>

<style lang="stylus">
  .login-component
    .rich-text
      margin-bottom 20px !important
      font-size px-to-rem(18px)
      .material-icons
        position relative
        top 4px
        margin-right 4px
        font-size 32px
        line-height 1
    .form-container
      .material-icons
        display inline-block
        margin-bottom 20px !important
        font-size px-to-rem(18px)

</style>
