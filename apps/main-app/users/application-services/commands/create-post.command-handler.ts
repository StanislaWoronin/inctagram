import {UploadPostImagesDto} from "../../dto/create-post.dto";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {CreatedPostView} from "../../view-model/created-post.view-model";
import {Inject} from "@nestjs/common";
import {Microservices} from "../../../../../libs/shared/enums/microservices-name.enum";
import {ClientProxy} from "@nestjs/microservices";
import {FileStorageRepository} from "../../db.providers/images/file.storage.repository";
import {Commands} from "../../../../../libs/shared/enums/pattern-commands-name.enum";
import {lastValueFrom, map} from "rxjs";

export class CreatePostCommand {
    constructor(public readonly dto: UploadPostImagesDto) {
    }
}

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
    implements ICommandHandler<CreatePostCommand, CreatedPostView> {
    constructor(
        @Inject(Microservices.FileStorage)
        private fileStorageProxyClient: ClientProxy,
        private fileStorageRepository: FileStorageRepository,
    ) {
    }

    async execute({dto}: CreatePostCommand): Promise<CreatedPostView> {
        const pattern = {cmd: Commands.UploadPostImages}
        const postImagesLink = await lastValueFrom(
            this.fileStorageProxyClient
                .send(pattern, dto)
                .pipe(map((result) => result)),
        );
        console.log(postImagesLink)
        const createdPost = await this.fileStorageRepository.savePost(dto.userId, dto.description, postImagesLink)
        console.log(createdPost)
        return {} as CreatedPostView
    }
}

