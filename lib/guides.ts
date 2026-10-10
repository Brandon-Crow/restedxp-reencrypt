export interface GuideConfig {
  id: string;
  title: string;
  description: string;
  guideUrl: string;
  sourceTag: string;
}

export const WOW_FOREVER_GUIDE: GuideConfig = {
  id: "wow-forever",
  title: "WoW Forever Guide",
  description: "The current guide prepared for the WoW Forever community.",
  guideUrl: "/guide-wow-forever.txt",
  sourceTag: "wowforever#0000",
};
