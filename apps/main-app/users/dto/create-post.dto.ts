import {Posts} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";
import {postConstant} from "../view-model/post.constant";
import {IsString, MaxLength} from "class-validator";
import {Transform} from "class-transformer";
import {Optional} from "@nestjs/common";

type TCreatePostDto = Pick<Posts, 'description'>

export class CreatePostDto implements TCreatePostDto {
    @ApiProperty({
        example: 'Some description for the current post.',
        maxLength: postConstant.description.maxLength,
    })
    @Optional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    @MaxLength(postConstant.description.maxLength)
    description: string
}

export class CreatePostTransportDto extends CreatePostDto {
    public userId: string;
    public postPhotos: Express.Multer.File;
    public buffers: Buffer;
}