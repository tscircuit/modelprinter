import type { z } from "zod"
import { THRUST_BALL_BEARING_511_TABLE } from "./table"

export interface ThrustBallBearingInputShape {
  code?: string
  innerDiameter?: number
  outerDiameter?: number
  height?: number
  flatWasherPair: true
  rows: 1
}

export function validateThrustBallBearingProps(
  p: ThrustBallBearingInputShape,
  ctx: z.RefinementCtx,
): void {
  const spec = p.code ? THRUST_BALL_BEARING_511_TABLE[p.code] : undefined
  if (p.code && !spec) {
    ctx.addIssue({
      code: "custom",
      path: ["code"],
      message: `Unsupported ISO 104 thrust ball bearing designation "${p.code}"`,
    })
    return
  }
  const id = p.innerDiameter ?? spec?.innerDiameter
  const od = p.outerDiameter ?? spec?.outerDiameter
  const h = p.height ?? spec?.height
  if (id === undefined) {
    ctx.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "innerDiameter is required when no series code is provided",
    })
  }
  if (od === undefined) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "outerDiameter is required when no series code is provided",
    })
  }
  if (h === undefined) {
    ctx.addIssue({
      code: "custom",
      path: ["height"],
      message: "height is required when no series code is provided",
    })
  }
  if (id === undefined || od === undefined || h === undefined) return

  if (spec) {
    if (
      Math.abs(id - spec.innerDiameter) > 1e-6 ||
      Math.abs(od - spec.outerDiameter) > 1e-6 ||
      Math.abs(h - spec.height) > 1e-6
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["code"],
        message: `Dimensions (${id}x${od}x${h} mm) do not match thrust bearing series ${spec.code} (${spec.innerDiameter}x${spec.outerDiameter}x${spec.height} mm)`,
      })
    }
  }
  if (od <= id) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Outer diameter must exceed bore inner diameter",
    })
  }
}
