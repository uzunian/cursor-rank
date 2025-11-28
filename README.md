# Cursor Team Leaderboard

A beautiful, interactive leaderboard dashboard for visualizing your team's Cursor AI usage and coding activity. Built with SvelteKit, TypeScript, and Tailwind CSS.

## Features

- 🏆 **Interactive Leaderboard** - Rank team members by various metrics
- ⏱️ **Time Filters** - View stats for 7 days, 30 days, 90 days, or all time
- 📊 **Multiple Sort Options** - Sort by activity score, lines added, accepts, applies, chat requests, and more
- 🎨 **Billboard-Ready Design** - Large, readable text perfect for display screens
- ✨ **Smooth Animations** - Polished transitions and hover effects
- 🎯 **Top 3 Podium** - Special display for top performers

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
cursor-rank/
├── src/
│   ├── lib/
│   │   ├── api/
│   │   │   └── mockData.ts      # Mock API data generator
│   │   └── types.ts              # TypeScript interfaces
│   ├── routes/
│   │   ├── +page.svelte          # Main leaderboard page
│   │   └── +layout.svelte        # App layout
│   └── app.css                   # Global styles
├── package.json
└── README.md
```

## Using Real API Data

To connect to the actual Cursor API:

1. Replace the mock data in `src/lib/api/mockData.ts` with a real API call:

```typescript
export async function fetchLeaderboard(timeFilter: TimeFilter): Promise<LeaderboardResponse> {
  const response = await fetch(
    `https://api.cursor.com/analytics/team/leaderboard?startDate=${timeFilter}&endDate=now`,
    {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_CURSOR_API_KEY}`
      }
    }
  );
  return response.json();
}
```

2. Add your API key to a `.env` file:
```
VITE_CURSOR_API_KEY=your_api_key_here
```

## Demo

This prototype uses realistic mock data to demonstrate the leaderboard functionality. The data includes:
- Team member names and emails
- Various coding metrics (lines added/deleted, accepts, applies, etc.)
- Activity scores calculated from multiple factors
- Different rankings based on selected time period

## Tech Stack

- **SvelteKit** - Modern web framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool and dev server

## License

MIT

