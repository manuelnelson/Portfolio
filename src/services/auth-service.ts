import { AccessToken } from '../store/entities/token';
import { LoginDto, IApiResponse } from '../store/entities';
import {apiService, ApiInstance} from './api';
const beansDeviceIdKey = 'beansDeviceId';

export class AuthService {
  private apiName : string;
	constructor() {
    this.apiName = 'auth';
  }
  
  async login(entity: LoginDto) : Promise<AccessToken | undefined>{
    entity.phoneToken = await this.getPhoneToken();
    entity.deviceId = this.getDeviceId();
    let response = await apiService.post<AccessToken>(`${this.apiName}/login`, entity);
    if(response.status ===  200 || response.status ===  201) {
      return response.parsedBody;
    }  
    return undefined;
  }

  getDeviceId() : string {
    let deviceId = localStorage.getItem(beansDeviceIdKey);
    if(deviceId)
      return deviceId;
    //else we need to generate one and store it
    deviceId = (new Date().getMilliseconds()*Math.random()*1000).toString();
    localStorage.setItem(beansDeviceIdKey,deviceId);
    return deviceId;
  }
  async getPhoneToken() : Promise<string> {
    return new Promise((resolve) => {
      if((window as any).FirebasePlugin) {
        (window as any).FirebasePlugin.onTokenRefresh((token:string) => {
          return resolve(token);
        });
      }
      else {
        return resolve('');
      }
    })
  }

  async refreshToken(refreshToken: string) : Promise<AccessToken | undefined>{
    const deviceId = this.getDeviceId();
    let response = await apiService.post<AccessToken>(`${this.apiName}/refresh-token`, {refreshToken,deviceId});
    if(response.status ===  200 || response.status ===  201) {
      return response.parsedBody;
    }
    return undefined;
  }

  async sendLoginCode(entity: LoginDto) : Promise<boolean>{
    let response = await apiService.post<IApiResponse>(`${this.apiName}/send-login-code`, entity);
    if((response.status ===  200 || response.status ===  201) && response.parsedBody) {
      return response.parsedBody.success;
    }
    return false;
  }
}

const authService = new AuthService();
export {authService};