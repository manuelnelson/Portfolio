import { BaseService } from './base-service';
import { FileDto, SignatureDto } from '../store/entities';
import { apiService } from './api';

export class FilesService extends BaseService<FileDto> {
  constructor() { 
    super('files');
  }
  async getSignature(folder:string, filename:string, filetype:string) : Promise<SignatureDto | undefined> {
    let response = await apiService.get<SignatureDto>(`${this.apiName}/signature/${folder}/${filename}/${filetype}`);
    if(response.status ===  200 || response.status ===  201) {
      return response.parsedBody;
    }
    //add error message to store
    return new SignatureDto();
  }
}

const filesService = new FilesService()
export {filesService}