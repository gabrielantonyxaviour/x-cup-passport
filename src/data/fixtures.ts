export type DemoFixture = {
  id: number;
  home: string;
  away: string;
  kickoffUtc: string;
  label: string;
  homeScore: number;
  awayScore: number;
  result: 1 | 2 | 3;
};

export const demoFixtures: DemoFixture[] = [
  {
    id: 1,
    home: "Brazil",
    away: "Japan",
    kickoffUtc: "2026-06-11T20:00:00Z",
    label: "Fixture/demo data for pre-tournament proof",
    homeScore: 2,
    awayScore: 0,
    result: 1,
  },
  {
    id: 2,
    home: "Argentina",
    away: "USA",
    kickoffUtc: "2026-06-12T20:00:00Z",
    label: "Fixture/demo data for pre-tournament proof",
    homeScore: 1,
    awayScore: 1,
    result: 3,
  },
];

export const resultLabel = (result: number, fixture: DemoFixture) => {
  if (result === 1) return `${fixture.home} win`;
  if (result === 2) return `${fixture.away} win`;
  return "Draw";
};
