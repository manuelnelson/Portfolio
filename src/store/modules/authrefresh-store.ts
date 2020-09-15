import { reactive } from 'vue';
import authrefreshService from '../../services/authrefresh-service'
import { AuthrefreshDto } from '../entities/authrefresh-dto';
import { NormalizedData, Normalize } from '../../services/normalizer-service';
// import "reflect-metadata";
import { IStore } from '..';

const authrefreshNormalizer = new Normalize<AuthrefreshDto>();

class AuthrefreshStore implements IStore {
  state = reactive({
    activeAuthrefresh: new AuthrefreshDto(),
    authrefreshIds: new Array<number>(),
    authrefreshs: {} as NormalizedData<AuthrefreshDto>   
  })
  
  //typically what'll be used
  get authrefreshList() : AuthrefreshDto[] {
    return this.state.authrefreshIds.reduce((acc,id) => { acc.push(this.state.authrefreshs[id]); return acc; }, new Array<AuthrefreshDto>())
  }

  setActiveAuthrefresh(authrefresh: AuthrefreshDto) {
    this.state.activeAuthrefresh = authrefresh;
  }

  removeActiveAuthrefresh() {
    //only add if it isn't already added
    this.state.activeAuthrefresh = new AuthrefreshDto();
  }
  addAuthrefresh(authrefresh: AuthrefreshDto) {
    this.state.authrefreshs[authrefresh.id] = authrefresh;
    // Vue.set(this.state.authrefreshs, authrefresh.id, authrefresh);
    this.state.authrefreshIds.push(authrefresh.id)
  }
  setAuthrefreshs(authrefreshs: AuthrefreshDto[]) {
    //only add if it isn't already added    
    const normalizedAuthrefreshs = authrefreshNormalizer.normalizeData(authrefreshs, name);
    this.state.authrefreshIds = normalizedAuthrefreshs.result;
    this.state.authrefreshs = normalizedAuthrefreshs.entities[name];
  }
  updateAuthrefresh(authrefresh:AuthrefreshDto) {
    this.state.authrefreshs[authrefresh.id] = authrefresh;
  }
  removeAuthrefresh(authrefresh: AuthrefreshDto) {
    delete this.state.authrefreshs[authrefresh.id]
    // Vue.delete(this.state.authrefreshs, authrefresh.id);
    this.state.authrefreshIds = this.state.authrefreshIds.filter(x => x != authrefresh.id);
  }

  clearAuthrefreshs() {
    this.state.authrefreshs = {};
    this.state.authrefreshIds = [];
  }

  async add(authrefresh: AuthrefreshDto) : Promise<AuthrefreshDto | undefined> {
    const authrefreshCreated = await authrefreshService.create(authrefresh);
    if(authrefreshCreated) {
      this.addAuthrefresh(authrefreshCreated);
      return authrefreshCreated;  
    }
    return undefined;
  }

  async get(id: number) : Promise<AuthrefreshDto | undefined> {
    const authrefreshCreated = await authrefreshService.get(id);
    if(authrefreshCreated) {
      this.setActiveAuthrefresh(authrefreshCreated);
      return authrefreshCreated;
    }
    return undefined;
  }

  async query(query: any) : Promise<boolean> {
    const authrefreshs = await authrefreshService.findAll(query);
    if(authrefreshs) {
      this.setAuthrefreshs(authrefreshs.data)
      return true;
    }
    return false;
  }

  
  /**
   * Updates authrefresh store
   * @param authrefresh 
   * @param [silentUpdate] -- only update the 
   * @returns update 
   */
  async update(authrefresh: AuthrefreshDto, silentUpdate: boolean = false) : Promise<boolean> {
    const authrefreshUpdated = await authrefreshService.update(authrefresh.id, authrefresh);
    if(authrefreshUpdated) {
      this.setActiveAuthrefresh(authrefreshUpdated);
      this.updateAuthrefresh(authrefreshUpdated);
      return true;
    }
    return false;
  }

  // async updateRelationship(authrefreshRelationship: AuthrefreshRelationshipDto) : Promise<boolean> {
  //   const authrefreshUpdated = await authrefreshService.updateRelationship(authrefreshRelationship.authrefresh.id, authrefreshRelationship.relationship);
  //   if(authrefreshUpdated) {
  //     this.setActiveAuthrefresh(authrefreshUpdated)
  //     return true;
  //   }
  //   return false;
  // }

  async remove(authrefresh: AuthrefreshDto) : Promise<boolean> {
    await authrefreshService.delete(authrefresh.id);
    this.removeActiveAuthrefresh()
    this.removeAuthrefresh(authrefresh)
    return true;
  }
}

const authrefreshStore = new AuthrefreshStore();
export {authrefreshStore}
