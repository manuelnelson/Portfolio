export enum LoginState {
  Initial = 0, LoggingIn, CodeSent, EnterCode, LoggedIn
}

export interface IApiResponse { 
  success: boolean  
}
 


export class LoginDto {
  email: string;

  phoneToken: string;
  validationCode: string;
  deviceId:string;
  redirectUrl: string; 
  constructor(data?:any) {
    data = data || {}
    this.email = data.email || '';
    this.validationCode = data.validationCode || '';
    this.phoneToken = data.phoneToken || '';
    this.deviceId = data.deviceId || '';
    this.redirectUrl = data.redirectUrl || '';
  }
}
export class RefreshTokenDto {
  refreshToken: string;
  deviceId:string;

  constructor() {
    this.refreshToken = '';
    this.deviceId = '';
  }
}

