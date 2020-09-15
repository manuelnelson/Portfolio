import { reactive, computed } from 'vue';
import { filesService } from '../../services/file.service'
import { FileDto, FileRelationshipDto } from '../entities/file-dto';
import { NormalizedData, Normalize } from '../../services/normalizer-service';
// import "reflect-metadata";
import { IStore } from '..';
import { Alert } from '../entities/alert';

const photoNormalizer = new Normalize<FileDto>();


class FileStore implements IStore {
  state = reactive({
    activePhoto: new FileDto(),
    photoIds: new Array<number>(),
    photos: {} as NormalizedData<FileDto>,
    alerts: [] as Alert[],
    counter: 0 as number
  })

  
  //typically what'll be used
  photoList = computed(() => {
    return this.state.photoIds.reduce((acc,id) => { acc.push(this.state.photos[id]); return acc; }, new Array<FileDto>())
  })

  setActivePhoto(photo: FileDto) {
    this.state.activePhoto = photo;
  }

  removeActivePhoto() {
    //only add if it isn't already added
    this.state.activePhoto = new FileDto();
  }
  addPhoto(photo: FileDto) {
    this.state.photos[photo.id] = photo
    this.state.photoIds.push(photo.id)

  }
  setPhotos(photos: FileDto[]) {
    //only add if it isn't already added    
    const normalizedPhotos = photoNormalizer.normalizeData(photos, name);
    this.state.photoIds = normalizedPhotos.result;
    this.state.photos = normalizedPhotos.entities[name];
  }

  removePhoto(photo: FileDto) {
    this.state.photoIds  = this.state.photoIds.filter(x => x != photo.id);
    delete this.state.photos[photo.id];
    // Vue.delete(this.state.photos, photo.id);
  }

  clearPhotos() {
    this.state.photos = {};
    this.state.photoIds = [];
  }

  async add(photo: FileDto) : Promise<FileDto> {
    const photoCreated = await filesService.create(photo);
    if(photoCreated) {
      this.addPhoto(photoCreated);
      return photoCreated;  
    }
    return new FileDto();
  }
  async get(id: number) : Promise<FileDto> {
    const photoCreated = await filesService.get(id);
    if(photoCreated) {
      this.setActivePhoto(photoCreated);
      return photoCreated;
    }
    return new FileDto();
  }

  async query(query: any) : Promise<boolean> {
    const photos = await filesService.findAll(query);
    if(photos) {
      this.setPhotos(photos.data)
      return true;
    }
    return false;
  }

  async update(photo: FileDto) : Promise<boolean> {
    const photoUpdated = await filesService.update(photo.id, photo);
    if(photoUpdated) {
      this.setActivePhoto(photoUpdated)
      return true;
    }
    return false;
  }

  async updateRelationship(photoRelationship: FileRelationshipDto) : Promise<boolean> {
    const photoUpdated = await filesService.updateRelationship(photoRelationship.file.id, photoRelationship.relationship);
    if(photoUpdated) {
      this.setActivePhoto(photoUpdated)
      return true;
    }
    return false;
  }

  async remove(photo: FileDto) : Promise<boolean> {
    await filesService.delete(photo.id);
    this.removeActivePhoto()
    this.removePhoto(photo)
    return true;
  }
}

const fileStore = new FileStore();
export {fileStore}
