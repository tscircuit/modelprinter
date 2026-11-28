import { THRUST_BALL_BEARING_511_TABLE } from "./table"
import type { ThrustBallBearingInputShape } from "./validate"

export function normalizeThrustBallBearingProps<
  T extends ThrustBallBearingInputShape,
>(p: T) {
  const spec = p.code ? THRUST_BALL_BEARING_511_TABLE[p.code] : undefined
  return {
    ...p,
    innerDiameter: p.innerDiameter ?? spec?.innerDiameter ?? 0,
    outerDiameter: p.outerDiameter ?? spec?.outerDiameter ?? 0,
    height: p.height ?? spec?.height ?? 0,
  }
}
