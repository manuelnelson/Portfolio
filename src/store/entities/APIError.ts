export class APIError implements IAPIError {
  message!: string
  error!: string
  statusCode!: number
  constructor(private readonly props:IAPIError) {
    Object.assign(this, props);
  }
}

export interface IAPIError {
  message: string
  error: string
  statusCode: number
}

export class BadRequest implements IBadRequest {
  property!: string
  constraints!: {
    [name: string]: string 
  }
  constructor(private readonly props:IAPIError) {
    Object.assign(this, props);
  }
}

export interface IBadRequest {
  property: string
  constraints: {
    [name: string]: string 
  }
}