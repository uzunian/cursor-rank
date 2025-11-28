import type { LeaderboardEntry, LeaderboardResponse, TimeFilter } from '../types';

const teamNames = [
  'Alex Chen',
  'Sam Rodriguez',
  'Jordan Kim',
  'Morgan Taylor',
  'Casey Williams',
  'Riley Martinez',
  'Avery Johnson',
  'Quinn Brown',
  'Sage Davis',
  'River Anderson',
  'Phoenix Wilson',
  'Blake Thompson',
  'Skylar Garcia',
  'Rowan Miller',
  'Emery Moore'
];

const teamEmails = teamNames.map((name, i) => 
  `${name.toLowerCase().replace(' ', '.')}@company.com`
);

// Generate realistic metrics based on time period
function generateMetrics(timeFilter: TimeFilter, baseMultiplier: number) {
  const multipliers: Record<TimeFilter, number> = {
    '7d': 1,
    '30d': 4.2,
    '90d': 12.5,
    'all': 50
  };

  const multiplier = multipliers[timeFilter] * baseMultiplier;
  const variance = () => 0.7 + Math.random() * 0.6; // 70-130% variance

  const totalLinesAdded = Math.floor(500 * multiplier * variance());
  const totalLinesDeleted = Math.floor(totalLinesAdded * (0.4 + Math.random() * 0.3));
  const acceptedLinesAdded = Math.floor(totalLinesAdded * (0.65 + Math.random() * 0.2));
  const acceptedLinesDeleted = Math.floor(totalLinesDeleted * (0.7 + Math.random() * 0.2));
  const totalApplies = Math.floor(50 * multiplier * variance());
  const totalAccepts = Math.floor(totalApplies * (0.75 + Math.random() * 0.15));
  const totalRejects = totalApplies - totalAccepts;
  const totalTabsShown = Math.floor(200 * multiplier * variance());
  const totalTabsAccepted = Math.floor(totalTabsShown * (0.8 + Math.random() * 0.15));
  const composerRequests = Math.floor(30 * multiplier * variance());
  const chatRequests = Math.floor(80 * multiplier * variance());
  const agentRequests = Math.floor(10 * multiplier * variance());
  const cmdkUsages = Math.floor(40 * multiplier * variance());
  const bugbotUsages = Math.floor(5 * multiplier * variance());
  const subscriptionIncludedReqs = Math.floor(150 * multiplier * variance());
  const apiKeyReqs = Math.floor(20 * multiplier * variance());
  const usageBasedReqs = Math.floor(10 * multiplier * variance());

  return {
    totalLinesAdded,
    totalLinesDeleted,
    acceptedLinesAdded,
    acceptedLinesDeleted,
    totalApplies,
    totalAccepts,
    totalRejects,
    totalTabsShown,
    totalTabsAccepted,
    composerRequests,
    chatRequests,
    agentRequests,
    cmdkUsages,
    bugbotUsages,
    subscriptionIncludedReqs,
    apiKeyReqs,
    usageBasedReqs
  };
}

// Calculate activity score based on various metrics
function calculateActivityScore(metrics: LeaderboardEntry['metrics']): number {
  return (
    metrics.totalAccepts * 2 +
    metrics.totalApplies * 1.5 +
    metrics.chatRequests * 1.2 +
    metrics.composerRequests * 1.5 +
    metrics.agentRequests * 2 +
    metrics.acceptedLinesAdded * 0.1 +
    metrics.cmdkUsages * 0.5
  );
}

// Generate entries for a specific time period
function generateEntriesForPeriod(timeFilter: TimeFilter): LeaderboardEntry[] {
  const now = Date.now();
  const periods: Record<TimeFilter, { start: number; end: number }> = {
    '7d': { start: now - 7 * 24 * 60 * 60 * 1000, end: now },
    '30d': { start: now - 30 * 24 * 60 * 60 * 1000, end: now },
    '90d': { start: now - 90 * 24 * 60 * 60 * 1000, end: now },
    'all': { start: now - 365 * 24 * 60 * 60 * 1000, end: now }
  };

  const period = periods[timeFilter];
  const numMembers = 12 + Math.floor(Math.random() * 3); // 12-14 members

  const entries: LeaderboardEntry[] = teamNames.slice(0, numMembers).map((name, index) => {
    // Vary base multiplier to create different activity levels
    const baseMultiplier = 0.3 + Math.random() * 1.7; // Creates varied activity
    const metrics = generateMetrics(timeFilter, baseMultiplier);
    const activityScore = calculateActivityScore(metrics);

    return {
      rank: 0, // Will be set after sorting
      name,
      email: teamEmails[index],
      role: index === 0 ? 'owner' : 'member',
      metrics,
      activityScore
    };
  });

  // Sort by activity score and assign ranks
  entries.sort((a, b) => b.activityScore - a.activityScore);
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return entries;
}

export function getMockLeaderboard(timeFilter: TimeFilter = '7d'): LeaderboardResponse {
  const entries = generateEntriesForPeriod(timeFilter);
  const now = Date.now();
  
  const periods: Record<TimeFilter, { start: number; end: number }> = {
    '7d': { start: now - 7 * 24 * 60 * 60 * 1000, end: now },
    '30d': { start: now - 30 * 24 * 60 * 60 * 1000, end: now },
    '90d': { start: now - 90 * 24 * 60 * 60 * 1000, end: now },
    'all': { start: now - 365 * 24 * 60 * 60 * 1000, end: now }
  };

  const period = periods[timeFilter];

  return {
    entries,
    period: {
      startDate: period.start,
      endDate: period.end
    },
    totalMembers: entries.length
  };
}

// Simulate API delay
export async function fetchLeaderboard(timeFilter: TimeFilter = '7d'): Promise<LeaderboardResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
  return getMockLeaderboard(timeFilter);
}

