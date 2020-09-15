import {authService } from '../../services/auth-service'
import { AccessToken, TokenUser } from '../entities/token';
import { LoginDto } from '../entities';

// import usersStore from './users.store';
import { IStore } from '..';
import { reactive, computed } from 'vue';

class AuthStore implements IStore {
  state = reactive({
    token: localStorage.getItem('token') != null ? new AccessToken(JSON.parse(localStorage.getItem('token') as string)) : null as (AccessToken | null),    
  })

  isLoggedIn = computed(()=>(this.state.token && this.state.token.accessToken.length > 0))

  setToken(token: AccessToken) {
    this.state.token = token;
    localStorage.setItem('token', JSON.stringify(this.state.token))
  }
 
  logout() {
    this.state.token = null;
    localStorage.removeItem('token')    
  }

  userId = computed(() => this.state.token ? (this.state.token as any).user.id as number : 0);
  accessToken = computed(() => this.state.token ? (this.state.token as any).accessToken as string : '');

  async refreshToken() : Promise<boolean> {
    console.log("AuthStore -> this.state.token", this.state.token)
    if(this.state.token && this.state.token.refreshToken) {
      const token = await authService.refreshToken(this.state.token.refreshToken);
      if(token && token.accessToken.length > 0) {
        this.setToken(token);
        return true;
      }  
      return false;
    }
    return false;
  }

  async login(login: LoginDto) : Promise<TokenUser | null> {
    const token = await authService.login(login);
    if(token && token.accessToken.length > 0) {
      this.setToken(token);
      return token.user;
    }
    return null;
  }

  async sendLoginCode(login: LoginDto) : Promise<boolean> {
    return await authService.sendLoginCode(login);
  }

}

const authStore = new AuthStore();
export {authStore};