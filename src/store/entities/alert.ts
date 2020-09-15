export class Alert implements IAlert {
  id!: number
  message!: string
  type!: AlertType
  disableTimeout?: boolean | undefined
  constructor(private readonly props?: IAlert) {
    Object.assign(this, props);
  }
}

export interface IAlert {
  id: number
  message: string
  type: AlertType,
  disableTimeout?: boolean
}

export enum AlertType {
  Info,
  Warning,
  Error
}