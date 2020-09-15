export interface IBaseDto {
  id: number;
}
export interface IOrderDto {
  order: number;
}
export interface ITreeDto{
  parentId: number;
  children: ITreeDto[];
}

export interface DtoList {
  data: Array<any>
  count: number
}