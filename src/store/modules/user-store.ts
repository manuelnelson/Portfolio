import { reactive } from 'vue';
import userService from '../../services/user-service'
import { UserDto } from '../entities/user-dto';
import { NormalizedData, Normalize } from '../../services/normalizer-service';
// import "refle/ct-metadata";
import { IStore } from '..';

const userNormalizer = new Normalize<UserDto>();

class UserStore implements IStore {
  state = reactive({
    activeUser: new UserDto(),
    userIds: new Array<number>(),
    users: {} as NormalizedData<UserDto>   
  })
  
  //typically what'll be used
  get userList() : UserDto[] {
    return this.state.userIds.reduce((acc,id) => { acc.push(this.state.users[id]); return acc; }, new Array<UserDto>())
  }

  setActiveUser(user: UserDto) {
    this.state.activeUser = user;
  }

  removeActiveUser() {
    //only add if it isn't already added
    this.state.activeUser = new UserDto();
  }
  addUser(user: UserDto) {
    this.state.users[user.id] = user;
    // Vue.set(this.state.users, user.id, user);
    this.state.userIds.push(user.id)

  }
  setUsers(users: UserDto[]) {
    //only add if it isn't already added    
    const normalizedUsers = userNormalizer.normalizeData(users, name);
    this.state.userIds = normalizedUsers.result;
    this.state.users = normalizedUsers.entities[name];
  }

  removeUser(user: UserDto) {
    delete this.state.users[user.id]
    // Vue.delete(this.state.users, user.id);
    this.state.userIds.filter(x => x != user.id);
  }

  clearUsers() {
    this.state.users = {};
    this.state.userIds = [];
  }

  async add(user: UserDto) : Promise<UserDto> {
    const userCreated = await userService.create(user);
    if(userCreated) {
      this.addUser(userCreated);
      return userCreated;  
    }
    return new UserDto();
  }

  async get(id: number) : Promise<UserDto> {
    const user = await userService.get(id);
    if(user) {
      this.setActiveUser(user);
      return user;
    }
    return new UserDto();
  }

  async query(query: any) : Promise<boolean> {
    const users = await userService.findAll(query);
    if(users) {
      this.setUsers(users.data)
      return true;
    }
    return false;
  }

  async update(user: UserDto) : Promise<boolean> {
    const userUpdated = await userService.update(user.id, user);
    if(userUpdated) {
      this.setActiveUser(userUpdated)
      return true;
    }
    return false;
  }

  // async updateRelationship(userRelationship: UserRelationshipDto) : Promise<boolean> {
  //   const userUpdated = await userService.updateRelationship(userRelationship.user.id, userRelationship.relationship);
  //   if(userUpdated) {
  //     this.setActiveUser(userUpdated)
  //     return true;
  //   }
  //   return false;
  // }

  async remove(user: UserDto) : Promise<boolean> {
    await userService.delete(user.id);
    this.removeActiveUser()
    this.removeUser(user)
    return true;
  }
}

const userStore = new UserStore();
export {userStore}
