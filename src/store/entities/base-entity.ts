import { IBaseDto, IOrderDto, ITreeDto } from './entity-interface';


export class BaseEntity implements IBaseDto  {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data?:any) {
    data = data || {}
    this.id = data.id || 0;
  }
}

export class OrderedEntity implements IBaseDto, IOrderDto  {
  id: number;
  order: number;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data?:any) {
    data = data || {}
    this.id = data.id || 0;
    this.order = data.order || 0;
  }
}
export class TreeEntity implements ITreeDto, IBaseDto  {
  id: number;
  parentId: number;
  children: TreeEntity[]
  childrenIds: number[]
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data?:any) {
    data = data || {}
    this.id = data.id || 0;
    this.parentId = data.parentId || 0;
    this.children = data.children || [];
    this.childrenIds = data.childrenIds || [];
  }
}

/**
 * fieldName: field on entity to update
 * value: id or value to add/remove
 * actoin: are we adding or removing value
 * typeName: Entity classname we are updating, i.e. User or Book
 * @export
 * @class RelationshipDto
 */
export class RelationshipDto {
  fieldName: string //
  value: number | number[]
  action: RelationshipAction  
  entityClassName: string 
  constructor(data?:any) {
    this.fieldName = data.fieldName;
    this.value = data.value;
    this.action = data.action;
    this.entityClassName = data.entityClassName;
  }
}

export enum RelationshipAction {
  add,
  remove, 
  set
}
