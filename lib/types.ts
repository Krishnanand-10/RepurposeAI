export type PlanTier = 'FREE' | 'PRO';

export type InputType = 'YOUTUBE' | 'BLOG' | 'TEXT';

export type AudienceTone = 'engaging' | 'professional' | 'storyteller' | 'punchy' | 'casual';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  avatar: string;
  planTier: PlanTier;
  creditsUsed: number;
  creditsMax: number;
  isPro: boolean;
}

export interface LinkedInAsset {
  hook: string;
  body: string;
  bulletPoints: string[];
  callToAction: string;
  hashtags: string[];
}

export interface TweetItem {
  tweetNumber: number;
  content: string;
  isHook?: boolean;
}

export interface VideoScriptAsset {
  hook: string;
  targetDuration: string;
  visualDirection: string;
  voiceoverScript: string;
  callToAction: string;
}

export interface SeoMetaAsset {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  slugSuggestion: string;
}

export interface NewsletterAsset {
  tldr: string;
  keyTakeaways: string[];
  highlightQuote: string;
}

export interface GeneratedAssetBundle {
  id?: string;
  title: string;
  summary: string;
  sourceUrl?: string;
  inputType: InputType;
  tone: AudienceTone;
  thumbnailUrl?: string;
  linkedinPost: LinkedInAsset;
  twitterThread: TweetItem[];
  videoScripts: VideoScriptAsset[];
  seoMeta: SeoMetaAsset;
  newsletterBrief: NewsletterAsset;
  createdAt?: string;
}

export interface RepurposeRequestPayload {
  inputType: InputType;
  sourceUrl?: string;
  rawText?: string;
  tone?: AudienceTone;
  targetAudience?: string;
  customInstructions?: string;
  userApiKey?: string;
  userEmail?: string;
}
