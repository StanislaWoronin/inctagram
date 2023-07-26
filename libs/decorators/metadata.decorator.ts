import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {ILoggerParams} from "../midleware/logger.midleware";
import {ClientMeta} from "../../apps/main-app/auth/dto/session-id.dto";

export interface IMetadata {
    clientMeta: ClientMeta,
    logger: ILoggerParams
}

export const Metadata = createParamDecorator(
    (data: string, ctx: ExecutionContext): IMetadata => {
        const request = ctx.switchToHttp().getRequest();
        return {
            clientMeta: {
                ipAddress: request.ip,
                title: request.headers['user-agent'],
            },
            logger: request.loggerParams
        }
    }
)