import { BaseEntity, RelationshipDto } from './base-entity';


export class AuthrefreshDto extends BaseEntity {
  constructor(data?: any) {
    super();
    data = data || {}
  }
}

export class FileRelationshipDto {
  relationship: RelationshipDto
  constructor(data?: any) {
    data = data || {}
    this.relationship = data.relationship;
  }
}