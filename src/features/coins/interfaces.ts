export interface CoinDetailResponse {
  id: string;
  symbol: string;
  name: string;
  web_slug?: string;
  asset_platform_id?: string | null;
  block_time_in_minutes?: number;
  hashing_algorithm?: string;
  categories: string[];
  description: {
    [key: string]: string;
  };
  links: {
    homepage: string[];
    whitepaper: string;
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  genesis_date: string;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  market_cap_rank: number;
  market_data: {
    current_price: { [key: string]: number };
    total_value_locked?: number | null;
    mcap_to_tvl_ratio?: number | null;
    fdv_to_tvl_ratio?: number | null;
    roi?: number | null;
    ath: { [key: string]: number };
    ath_change_percentage: { [key: string]: number };
    ath_date: { [key: string]: string };
    atl: { [key: string]: number };
    atl_change_percentage: { [key: string]: number };
    atl_date: { [key: string]: string };
    market_cap: { [key: string]: number };
    fully_diluted_valuation: { [key: string]: number };
    total_volume: { [key: string]: number };
    high_24h: { [key: string]: number };
    low_24h: { [key: string]: number };
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_60d: number;
    price_change_percentage_200d: number;
    price_change_percentage_1y: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    total_supply: number | null;
    max_supply: number | null;
    circulating_supply: number;
    last_updated: string;
  };
  last_updated: string;
}
