import { BaseEntity, RelationshipDto } from './base-entity';


export class FileDto extends BaseEntity {
  url: string = '';
  altText: string = '';
  feedUrl: string = '';
  minimized: boolean = false;
  constructor(data?: any) {
    super();
    data = data || {}
    this.url = data.url || '';
    this.altText = data.altText || '';
    this.feedUrl = data.feedUrl || '';
    this.minimized = data.minimized || false;
  }
}

export class FileRelationshipDto {
  file: FileDto
  relationship: RelationshipDto
  constructor(data?: any) {
    data = data || {}
    this.file = data.photo;
    this.relationship = data.relationship;
  }
}
export class SignatureDto {
  s3url: string = ''
}