export function calculateNewMMR(
  homeMMR: number,
  awayMMR: number,
  homeScore: number,
  awayScore: number
): number[] {
  const homeElo = calculateElo(homeMMR, awayMMR);
  const awayElo = calculateElo(awayMMR, homeMMR);

  const result = homeScore > awayScore ? 1 : homeScore === awayScore ? 0.5 : 0;

  const homeNewRating = homeMMR + 32 * (result - homeElo);
  const awayNewRating = awayMMR + 32 * (1 - result - awayElo);

  return [homeNewRating, awayNewRating];
}

function calculateElo(playerRating: number, opponentRating: number) {
  const difference = opponentRating - playerRating;
  const exponent = difference / 400;
  const base = 10;
  const powerOf10 = Math.pow(base, exponent);
  const denominator = 1 + powerOf10;
  const elo = 1 / denominator;
  return elo;
}
