import { DtoList, IBaseDto, RelationshipDto } from '../store/entities';
import { IBaseService } from '../store/types/base.service';
import { globalStore } from "../store/modules/global-store";
import { apiService } from './api';
//good source for some additional code https://github.com/nestjsx/crud/
export class BaseService<T extends IBaseDto> implements IBaseService<T> {
  protected apiName : string;
  protected hasLocalStorage: boolean
	constructor(protected readonly apiUrl: string, protected readonly useLocalStorageIfNotLoggedIn: boolean = false) {
    this.apiName = apiUrl;
    this.hasLocalStorage = useLocalStorageIfNotLoggedIn;
  }

  private getLocalList() : Array<T>{
    let localItem = localStorage.getItem(this.apiName)
    if(localItem) 
      return JSON.parse(localItem) as Array<T>
    return new Array<T>()
  }
  private store(list: Array<T>) : void {
    list.sort((a,b) => a.id - b.id) // make sure to re-order
    localStorage.setItem(this.apiName,JSON.stringify(list));
  }
  private shouldUseLocalStorage() : boolean {
    return this.hasLocalStorage && globalStore.state.shouldUseLocalStorage
  }
  async create(entity: T) : Promise<T | undefined>{
    if(this.shouldUseLocalStorage()) {
      let list = this.getLocalList();
      entity.id = list.length > 0 ? list[list.length-1].id++ : 1; //get last item id, increment by
      list.push(entity);
      this.store(list);
      return entity;
    }
    let response = await apiService.post<T>(this.apiName, entity);
    if(response.status ===  200 || response.status ===  201 || response.status ===  201) {
      return response.parsedBody;
    }
    throw new Error("Error adding " + this.apiUrl);  
  }

  async getAll() : Promise<DtoList | undefined> {
    if(this.shouldUseLocalStorage()) {
      let list =this.getLocalList();
      return {data:list, count: list.length}
    }
    let response = await apiService.get<DtoList>(this.apiName);
    if(response.status ===  200 || response.status ===  201) {
      return response.parsedBody;
    }
    throw new Error("Error retrieving " + this.apiUrl);
  }

  async get(id: number) : Promise<T | undefined> {
    if(this.shouldUseLocalStorage()) {
      let list =this.getLocalList();
      return list.find(x => x.id == id);
    }
    let response = await apiService.get<T>(`${this.apiName}/${id}`);
    if(response.status ===  200 || response.status ===  201) {
      return response.parsedBody;
    }
    return undefined;
  }

  async delete(id: number) : Promise<T | undefined> {
    if(this.shouldUseLocalStorage()) {
      let list = this.getLocalList();
      const item = list.find(x => x.id == id);
      list = list.filter(x => x.id != id);
      this.store(list);
      return item;
    }
    let response = await apiService.remove<T>(`${this.apiName}/${id}`);
    if(response.status ===  200 || response.status ===  201) {
      return response.parsedBody;
    }
    throw new Error("Error deleting " + this.apiUrl);
  }
  async findOne(query: any) : Promise<T | undefined>{    
    if(this.shouldUseLocalStorage()) {
      let list = await this.findAll(query);
      return list ? list.data[0] : undefined;
    }
    let response = await apiService.get<DtoList>(`${this.apiName}?${this.objectToQueryString(query)}`);
    if(response.status ===  200 || response.status ===  201) {
      if((response.parsedBody as DtoList).count > 0)
        return (response.parsedBody as DtoList).data[0];
      return undefined;
    }
    throw new Error("Error querying " + this.apiUrl);
  }

  async findAll(query: any) : Promise<DtoList | undefined>{  
    if(this.shouldUseLocalStorage()) {
      const keys = Object.keys(query)
      if(!query || keys.length == 0) {
        return await this.getAll();
      }
      let list = this.getLocalList();
      // let key = keys[0];
      keys.forEach(key => {
        list = list.filter((x:any) => x[key] == query[key]);
      })
      return {data:list, count:list.length};
      // this.getLocalList().filter(x => )
      //TODO: FIGURE OUT WAY TO DO SUCCINCT QUERYING HERE THAT MATCHED BACKEND - wait until we have a real example, might also need to use sub-class for this one when we need it.
      // let list = await this.findAll(query);
      // return list ? list.data[0] : undefined;
    }
    if(query && query.ids && query.ids.length === 0) {
      delete query.ids  
      if(Object.keys(query).length === 0)
        return {data:[],count:0}
    }
    let response = await apiService.get<DtoList>(`${this.apiName}?${this.objectToQueryString(query)}`);
    if(response.status ===  200 || response.status ===  201) {
      return response.parsedBody;
    }
    throw new Error("Error querying " + this.apiUrl);
  }

  async update(id: number, entity: any): Promise<T | undefined>{
    if(this.shouldUseLocalStorage()) {
      let list =this.getLocalList();
      const itemNdx = list.findIndex(x => x.id == id);
      let item = list.splice(itemNdx,1)[0];
      item = Object.assign(item, entity) as T;
      list.push(item);
      this.store(list);
      return item;
    }
    let response = await apiService.put<T>(`${this.apiName}/${id}`, entity);
    if(response.status ===  200 || response.status ===  201)
      return response.parsedBody;
    throw new Error("Error updating " + this.apiUrl);
  }

  //TODO - we shouldn't need this...there has got to be a better way to handle relationships
  async updateRelationship(id: number, relationship: RelationshipDto): Promise<T | undefined> {
    let response = await apiService.put<T>(`${this.apiName}/${id}/relationship`, relationship);
    if(response.status ===  200 || response.status ===  201)
      return response.parsedBody;
    throw new Error("Error updating " + this.apiUrl);
  }

  //helper querystring function
  protected objectToQueryString(query:any) : string {
    if(query && Object.keys(query).length > 0) {
      return Object.keys(query).map(x => {
        if(Array.isArray(query[x]))
          return `${x}=[${encodeURIComponent(query[x])}]`     
        else   
          return `${x}=${encodeURIComponent(query[x])}`
      }).join('&')  
    }
    return '';
  }
}
