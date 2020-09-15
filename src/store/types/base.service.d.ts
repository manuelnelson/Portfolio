import { DtoList, RelationshipDto } from '../entities';

export interface IBaseService<T> {
  create(entity: T) : Promise<T | undefined>

  getAll() : Promise<DtoList | undefined>

  get(id: number) : Promise<T | undefined> 

  delete(id: number) : Promise<T | undefined>

  findOne(query: any) : Promise<T | undefined>  
  
  findAll(query: any) : Promise<DtoList | undefined> 

  update(id: number, entity: any): Promise<T | undefined> 
  
  updateRelationship(id: number, relationship: RelationshipDto): Promise<T | undefined>
}