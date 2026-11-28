import type { PlanetaryGearmotorShape } from "./validate"

export function normalizePlanetaryGearmotorProps<
  T extends PlanetaryGearmotorShape,
>(p: T) {
  return {
    ...p,
    mountThread: p.mountThread.toLowerCase(),
  }
}
