import { BaseEntity, TreeEntity } from '../store/entities';

export class Normalize<T extends BaseEntity> {
   normalizeData(entities: Array<T>, name: string) : NormalizedResult<T>  {
    const ids = entities.map(x => x.id);
    const byIds = entities.reduce((acc, entity) => ({...acc, [entity.id]: entity}), {});
    return {
      result: ids,
      entities: {
        [name]: byIds
      }
    }
  }
}
export class NormalizeTree<T extends TreeEntity> {
 normalizeData(entities: Array<T>, name: string) : NormalizedResult<T>  {
   const ids = entities.reduce((acc,x) => { return this.addChildren(x, acc);}, new Array<number>());
   const byIds = ids.reduce((acc, id) => ({...acc, [id]: this.findEntity(id, {id:-1,parentId:-1,childrenIds:[],children:entities, createdAt: new Date(), updatedAt: new Date()})}), {});
   return {
     result: ids,
     entities: {
       [name]: byIds
     }
   }
 }

 addChildren(entity: TreeEntity, array: number[]) : number[] {
  array.push(entity.id);
  if(entity.children)
    entity.children.map(x => this.addChildren(x, array))
  return array;
 } 
 //TODO: i should read up on trees to find a more optimal solution here
 findEntity(id:number, item: TreeEntity) : TreeEntity | undefined {
    if(item.id === id) {
      if(item.children)
        item.childrenIds = item.children.map(x=>x.id);
      return item;
    }
    var result = undefined;
    if(item.children) {
      for(var i=0; result == undefined && i < item.children.length; i++) {
        result = this.findEntity(id, item.children[i])
      } 
    }
    return result;
  }
}

//https://stackoverflow.com/questions/52851557/typescript-type-or-interface-for-normalized-data
export interface NormalizedEntity<T> {
  [name: string]: NormalizedData<T>;
}
export interface NormalizedData<T> {
  [Key: number]: T;
}
export interface NormalizedResult<T extends BaseEntity> {
  result: Array<number>; //array of all ids
  entities: NormalizedEntity<T>;
}