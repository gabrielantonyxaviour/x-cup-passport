/** World Cup 2026 nations for the passport mint picker (representative set). */
export type Nation = { name: string; code: string; flag: string };

export const NATIONS: Nation[] = [
  { name: "Argentina", code: "AR", flag: "🇦🇷" },
  { name: "Brazil", code: "BR", flag: "🇧🇷" },
  { name: "France", code: "FR", flag: "🇫🇷" },
  { name: "England", code: "GB", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "Spain", code: "ES", flag: "🇪🇸" },
  { name: "Germany", code: "DE", flag: "🇩🇪" },
  { name: "Portugal", code: "PT", flag: "🇵🇹" },
  { name: "Netherlands", code: "NL", flag: "🇳🇱" },
  { name: "Mexico", code: "MX", flag: "🇲🇽" },
  { name: "USA", code: "US", flag: "🇺🇸" },
  { name: "Canada", code: "CA", flag: "🇨🇦" },
  { name: "Croatia", code: "HR", flag: "🇭🇷" },
  { name: "Belgium", code: "BE", flag: "🇧🇪" },
  { name: "Uruguay", code: "UY", flag: "🇺🇾" },
  { name: "Japan", code: "JP", flag: "🇯🇵" },
  { name: "Morocco", code: "MA", flag: "🇲🇦" },
  { name: "Nigeria", code: "NG", flag: "🇳🇬" },
  { name: "Serbia", code: "RS", flag: "🇷🇸" },
  { name: "Australia", code: "AU", flag: "🇦🇺" },
  { name: "Wales", code: "GB-WLS", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  { name: "Iran", code: "IR", flag: "🇮🇷" },
  { name: "Senegal", code: "SN", flag: "🇸🇳" },
  { name: "Colombia", code: "CO", flag: "🇨🇴" },
  { name: "Korea Republic", code: "KR", flag: "🇰🇷" },
];

export const nationByName = (name: string) =>
  NATIONS.find((n) => n.name === name);
