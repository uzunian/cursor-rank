export interface LeaderboardEntry {
  rank: number;
  name: string;
  email: string;
  role: 'owner' | 'member';
  metrics: {
    totalLinesAdded: number;
    totalLinesDeleted: number;
    acceptedLinesAdded: number;
    acceptedLinesDeleted: number;
    totalApplies: number;
    totalAccepts: number;
    totalRejects: number;
    totalTabsShown: number;
    totalTabsAccepted: number;
    composerRequests: number;
    chatRequests: number;
    agentRequests: number;
    cmdkUsages: number;
    bugbotUsages: number;
    subscriptionIncludedReqs: number;
    apiKeyReqs: number;
    usageBasedReqs: number;
  };
  activityScore: number; // Calculated score for ranking
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  period: {
    startDate: number;
    endDate: number;
  };
  totalMembers: number;
}

export type TimeFilter = '7d' | '30d' | '90d' | 'all';

export type SortField = 
  | 'rank'
  | 'activityScore'
  | 'totalLinesAdded'
  | 'totalAccepts'
  | 'totalApplies'
  | 'chatRequests'
  | 'composerRequests'
  | 'name';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

