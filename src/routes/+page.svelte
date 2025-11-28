<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchLeaderboard } from '$lib/api/mockData';
  
  // Import types using namespace to avoid import type syntax issues
  import * as Types from '$lib/types';
  type LeaderboardEntry = Types.LeaderboardEntry;
  type TimeFilter = Types.TimeFilter;
  type SortField = Types.SortField;
  type SortConfig = Types.SortConfig;

  let loading = true;
  let entries: LeaderboardEntry[] = [];
  let timeFilter: TimeFilter = '7d';
  let sortConfig: SortConfig = { field: 'rank', direction: 'asc' };
  let period = { startDate: 0, endDate: 0 };
  let totalMembers = 0;

  const timeFilters: { label: string; value: TimeFilter }[] = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: 'All Time', value: 'all' }
  ];

  const sortFields: { label: string; value: SortField; metric: keyof LeaderboardEntry['metrics'] | 'activityScore' }[] = [
    { label: 'Rank', value: 'rank', metric: 'activityScore' },
    { label: 'Activity Score', value: 'activityScore', metric: 'activityScore' },
    { label: 'Lines Added', value: 'totalLinesAdded', metric: 'totalLinesAdded' },
    { label: 'Accepts', value: 'totalAccepts', metric: 'totalAccepts' },
    { label: 'Applies', value: 'totalApplies', metric: 'totalApplies' },
    { label: 'Chat Requests', value: 'chatRequests', metric: 'chatRequests' },
    { label: 'Composer Requests', value: 'composerRequests', metric: 'composerRequests' }
  ];

  function getRankBadge(rank: number) {
    if (rank === 1) return { emoji: '🥇', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    if (rank === 2) return { emoji: '🥈', color: 'text-gray-300', bg: 'bg-gray-300/20' };
    if (rank === 3) return { emoji: '🥉', color: 'text-amber-600', bg: 'bg-amber-600/20' };
    return { emoji: `#${rank}`, color: 'text-gray-400', bg: 'bg-gray-700/50' };
  }

  function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  function getMetricValue(entry: LeaderboardEntry, field: SortField): number {
    if (field === 'rank') return entry.rank;
    if (field === 'activityScore') return entry.activityScore;
    return entry.metrics[field as keyof typeof entry.metrics] as number;
  }

  function sortEntries() {
    entries = [...entries].sort((a, b) => {
      const aVal = getMetricValue(a, sortConfig.field);
      const bVal = getMetricValue(b, sortConfig.field);
      const comparison = aVal - bVal;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
    
    // Reassign ranks if sorting by rank
    if (sortConfig.field === 'rank') {
      entries.forEach((entry, index) => {
        entry.rank = index + 1;
      });
    }
  }

  async function loadData() {
    loading = true;
    try {
      const response = await fetchLeaderboard(timeFilter);
      entries = response.entries;
      period = response.period;
      totalMembers = response.totalMembers;
      sortEntries();
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      loading = false;
    }
  }

  function handleTimeFilterChange(newFilter: TimeFilter) {
    timeFilter = newFilter;
    loadData();
  }

  function handleSort(field: SortField) {
    if (sortConfig.field === field) {
      sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      sortConfig.field = field;
      sortConfig.direction = 'desc';
    }
    sortEntries();
  }

  onMount(() => {
    loadData();
  });
</script>

<div class="min-h-screen p-4 md:p-8 lg:p-12">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Cursor Team Leaderboard
      </h1>
      <p class="text-xl md:text-2xl text-gray-400">
        Track your team's coding activity and productivity
      </p>
    </div>

    <!-- Time Filters -->
    <div class="mb-8 flex flex-wrap justify-center gap-4">
      {#each timeFilters as filter}
        <button
          on:click={() => handleTimeFilterChange(filter.value)}
          class="px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-200
            {timeFilter === filter.value
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/50 scale-105'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105'}"
        >
          {filter.label}
        </button>
      {/each}
    </div>

    <!-- Sort Controls -->
    <div class="mb-6 flex flex-wrap justify-center gap-3">
      <span class="text-gray-400 text-lg font-medium self-center">Sort by:</span>
      {#each sortFields as field}
        <button
          on:click={() => handleSort(field.value)}
          class="px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all duration-200
            {sortConfig.field === field.value
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}"
        >
          {field.label}
          {#if sortConfig.field === field.value}
            <span class="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Loading State -->
    {#if loading}
      <div class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    {:else}
      <!-- Leaderboard -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
        <!-- Top 3 Podium -->
        {#if entries.length >= 3 && sortConfig.field === 'rank'}
          <div class="grid grid-cols-3 gap-4 p-6 bg-gradient-to-b from-gray-800/80 to-transparent border-b border-gray-700/50">
            {#each entries.slice(0, 3) as entry, index}
              {@const badge = getRankBadge(entry.rank)}
              {@const order = index === 0 ? [1, 0, 2] : index === 1 ? [0, 1, 2] : [0, 2, 1]}
              {@const entryIndex = order[index]}
              <div class="flex flex-col items-center transform transition-all duration-300 hover:scale-105
                {entryIndex === 0 ? 'order-2' : entryIndex === 1 ? 'order-1' : 'order-3'}
                {entryIndex === 0 ? 'scale-110' : ''}">
                <div class="text-6xl mb-2">{badge.emoji}</div>
                <div class="text-2xl font-bold text-white mb-1">{entry.name}</div>
                <div class="text-sm text-gray-400 mb-3">{entry.email}</div>
                <div class="text-3xl font-bold {badge.color} mb-2">
                  {formatNumber(Math.round(entry.activityScore))}
                </div>
                <div class="text-xs text-gray-500">Activity Score</div>
              </div>
            {/each}
          </div>
        {/if}

        <!-- Leaderboard Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-900/50">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rank</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Name</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Activity Score</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Lines Added</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Accepts</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Applies</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Chat Requests</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Composer</th>
              </tr>
            </thead>
            <tbody>
              {#each entries as entry (entry.email)}
                {@const badge = getRankBadge(entry.rank)}
                <tr class="border-t border-gray-700/30 hover:bg-gray-700/30 transition-all duration-200 group">
                  <td class="px-6 py-5">
                    <div class="flex items-center gap-3">
                      <span class="text-2xl">{badge.emoji}</span>
                      <span class="text-lg font-bold {badge.color}">{entry.rank}</span>
                    </div>
                  </td>
                  <td class="px-6 py-5">
                    <div>
                      <div class="text-xl font-semibold text-white">{entry.name}</div>
                      <div class="text-sm text-gray-400">{entry.email}</div>
                    </div>
                  </td>
                  <td class="px-6 py-5">
                    <div class="text-xl font-bold text-blue-400">
                      {formatNumber(Math.round(entry.activityScore))}
                    </div>
                  </td>
                  <td class="px-6 py-5">
                    <div class="text-lg text-gray-300">{formatNumber(entry.metrics.totalLinesAdded)}</div>
                  </td>
                  <td class="px-6 py-5">
                    <div class="text-lg text-green-400">{formatNumber(entry.metrics.totalAccepts)}</div>
                  </td>
                  <td class="px-6 py-5">
                    <div class="text-lg text-purple-400">{formatNumber(entry.metrics.totalApplies)}</div>
                  </td>
                  <td class="px-6 py-5">
                    <div class="text-lg text-cyan-400">{formatNumber(entry.metrics.chatRequests)}</div>
                  </td>
                  <td class="px-6 py-5">
                    <div class="text-lg text-pink-400">{formatNumber(entry.metrics.composerRequests)}</div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <!-- Footer Stats -->
        <div class="px-6 py-4 bg-gray-900/50 border-t border-gray-700/50">
          <div class="flex justify-between items-center text-sm text-gray-400">
            <span>Total Members: <span class="text-white font-semibold">{totalMembers}</span></span>
            <span>
              Period: {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
</style>

