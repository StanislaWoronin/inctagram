import {OAuthService} from "./third-party-services.adapter/oauth.service";
import {Test} from "@nestjs/testing";
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('Test OAuth service.', () => {
    let oauthService = OAuthService
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [OAuthService],
        })
            .useMocker((token) => {
                const results = ['test1', 'test2'];
                if (token === OAuthService) {
                    return {findAll: jest.fn().mockResolvedValue(results)};
                }
                if (typeof token === 'function') {
                    const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
                    const Mock = moduleMocker.generateFromMetadata(mockMetadata);
                    return new Mock();
                }
            })
            .compile();

        oauthService = moduleRef.get(OAuthService);
    })

    it('', async () => {})
});
