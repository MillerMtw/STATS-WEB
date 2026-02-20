import { StatsData, CountryStat } from '../types';

const BASE_API_URL = 'https://stats-apex.vercel.app/api/stats';

// Define fetch options to aggressively disable caching from browsers and proxies
const fetchOptions: RequestInit = {
  cache: 'no-store',
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
};

const fetchStrategies = [
  /**
   * Strategy 1: allorigins.win
   * Often reliable, wraps response in JSON.
   */
  async (): Promise<string | null> => {
    const targetUrlWithBust = `${BASE_API_URL}?t=${Date.now()}`;
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrlWithBust)}`;
    const response = await fetch(url, fetchOptions);
    if (!response.ok) return null;
    const data = await response.json();
    return data.contents;
  },

  /**
   * Strategy 2: corsproxy.io
   * Good for direct text responses.
   */
  async (): Promise<string | null> => {
    const targetUrlWithBust = `${BASE_API_URL}?t=${Date.now()}`;
    const url = `https://corsproxy.io/?${encodeURIComponent(targetUrlWithBust)}`;
    const response = await fetch(url, fetchOptions);
    if (!response.ok) return null;
    return response.text();
  },

  /**
   * Strategy 3: Direct fetch
   * Last resort, will likely fail due to CORS in a browser environment.
   */
  async (): Promise<string | null> => {
    const targetUrlWithBust = `${BASE_API_URL}?t=${Date.now()}`;
    const response = await fetch(targetUrlWithBust, fetchOptions);
    if (!response.ok) return null;
    return response.text();
  },
];


/**
 * Tries to fetch stats using different methods to bypass CORS issues.
 */
export const fetchStats = async (): Promise<StatsData> => {
  for (const strategy of fetchStrategies) {
    try {
      const text = await strategy();
      if (text && text.includes('Online:')) {
        return parseStatsText(text);
      }
    } catch (e) {
      // Log strategy failure and continue to the next one
      console.warn('A fetch strategy failed, trying next...', e);
    }
  }

  // Final Fallback: Return empty state if all strategies fail
  console.error('All fetch methods failed.');
  return {
    online: 0,
    today: 0,
    newUsers: 0,
    allTime: 0,
    countries: [],
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Parses the raw text data from the API into a structured StatsData object.
 * This implementation is robustly designed to handle the specific text format.
 */
const parseStatsText = (text: string): StatsData => {
  const stats: StatsData = {
    online: 0,
    today: 0,
    newUsers: 0,
    allTime: 0,
    countries: [],
    lastUpdated: new Date().toISOString()
  };

  // Separate main stats from country data for clearer parsing
  let mainStatsStr = text;
  let countriesStr = '';
  
  const countriesIndex = text.indexOf('Countries:');
  if (countriesIndex > -1) {
    mainStatsStr = text.substring(0, countriesIndex);
    countriesStr = text.substring(countriesIndex + 'Countries:'.length);
  }

  // 1. Parse main stats (e.g., "Online: 2 / Today: 3 / ...")
  const mainSegments = mainStatsStr.split('/').map(s => s.trim());
  mainSegments.forEach(segment => {
    const parts = segment.split(':').map(p => p.trim());
    if (parts.length === 2) {
      const key = parts[0];
      const value = parseInt(parts[1]) || 0;
      switch (key) {
        case 'Online':
          stats.online = value;
          break;
        case 'Today':
          stats.today = value;
          break;
        case 'New Users':
          stats.newUsers = value;
          break;
        case 'All Time':
          stats.allTime = value;
          break;
      }
    }
  });

  // 2. Parse countries (e.g., "Mexico : 1 / United States : 1")
  if (countriesStr) {
    const countrySegments = countriesStr.split('/').map(s => s.trim()).filter(s => s);
    countrySegments.forEach(segment => {
      const parts = segment.split(':').map(p => p.trim());
      if (parts.length === 2) {
        const name = parts[0];
        const count = parseInt(parts[1]) || 0;
        if (name && count > 0) {
          stats.countries.push({ name, count, percentage: 0 });
        }
      }
    });
  }

  // 3. Calculate percentages and sort countries by count
  const totalCountryCount = stats.countries.reduce((sum, c) => sum + c.count, 0);
  if (totalCountryCount > 0) {
    stats.countries.forEach(c => {
      c.percentage = Math.round((c.count / totalCountryCount) * 100);
    });
  }
  stats.countries.sort((a, b) => b.count - a.count);

  return stats;
};
