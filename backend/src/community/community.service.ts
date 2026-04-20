import { Injectable } from "@nestjs/common";
import { mockStore } from "../common/mock-store";

@Injectable()
export class CommunityService {
  listPosts() {
    return mockStore.communityPosts.map((post: any) => ({
      ...post,
      excerpt:
        post.excerpt ||
        `A shared itinerary for ${post.location} featuring ${(post.featuredActivities || []).slice(0, 2).join(", ") || "local highlights"}.`,
      featuredActivities: post.featuredActivities || [],
      totalSpent: post.totalSpent || 0,
      duration: post.duration || 0,
    }));
  }
}
