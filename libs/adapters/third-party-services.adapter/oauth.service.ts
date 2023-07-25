import {Injectable} from "@nestjs/common";
import {NewUser} from "../../../apps/main-app/users/entities/new-user.entity";
import {getClientName} from "../../shared/helpers";
import {ViewUser} from "../../../apps/main-app/users/view-model/user.view-model";
import {EmailManager} from "../email.adapter";
import {GoogleAdapter} from "./google.adapter";
import {UserRepository} from "../../../apps/main-app/users/db.providers/user/user.repository";
import {UserQueryRepository} from "../../../apps/main-app/users/db.providers/user/user-query.repository";

@Injectable()
export abstract class OAuthService {
    constructor(
        private readonly emailManager: EmailManager,
        private googleAdapter: GoogleAdapter,
        private userRepository: UserRepository,
        private userQueryRepository: UserQueryRepository
    ) {}

    async registerUser({name, email, avatarUrl}) {
        const user = await this.userQueryRepository.getUserByField(email)
        if (user) {
            this.emailManager.sendRefinementEmail(user.email)
            return
        }

        const lastClientName = await this.userQueryRepository.getLastClientName();
        let newUser = NewUser.createViaThirdPartyServices({name, email});
        newUser.userName = getClientName(lastClientName)

        const createdUser =
            await this.userRepository.createUserViaThirdPartyServices(
                newUser,
                avatarUrl,
            );

        this.emailManager.sendCongratulationWithAuthEmail(
            createdUser.email,
        );

        return await ViewUser.toView(createdUser);
    }
}