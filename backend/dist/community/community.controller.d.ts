import { CommunityService } from "./community.service";
export declare class CommunityController {
    private readonly communityService;
    constructor(communityService: CommunityService);
    listPosts(): any;
}
