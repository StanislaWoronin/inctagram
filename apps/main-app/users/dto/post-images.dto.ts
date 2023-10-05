import { PostDto } from './post.dto';

export class PostImagesDto extends PostDto {
  public postPhotos: Buffer[];
}
