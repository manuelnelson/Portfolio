
export class AccessToken {
  expiresIn: string;
  accessToken: string
  refreshToken: string
  user!: TokenUser
  constructor(data: AccessToken) {
    data = data
    this.expiresIn = data.expiresIn || '';
    this.accessToken = data.accessToken || '';
    this.refreshToken = data.refreshToken || '';
    if(data.user) {
      this.user = data.user;
    } 
    else 
    {
      this.user = new TokenUser({})
    }
  }
}

export class TokenUser {
  id: number
  email: string
  constructor(data?:any) {
    data = data || {};
    this.id = data.id || 0
    this.email = data.email || ''
  }
}