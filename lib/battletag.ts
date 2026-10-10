const BATTLETAG_RE = /^[^#\s]+#\d+$/;

export function normalizeBattleTag(value: string): string {
  return value.trim();
}

export function isValidBattleTag(value: string): boolean {
  return BATTLETAG_RE.test(normalizeBattleTag(value));
}
