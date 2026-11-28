import type { z } from "zod"

export interface SplitShaftCollarShape {
  boreDiameter: number
  outerDiameter: number
  width: number
  twoPieceClamp: true
  bolts: number
  thread: string
}

export function validateSplitShaftCollarProps(
  p: SplitShaftCollarShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.outerDiameter <= p.boreDiameter + 2 * majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["outerDiameter"],
      message: "Collar OD must exceed boreDiameter + 2 * clamp screw diameter",
    })
  }
  if (p.width <= majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["width"],
      message: "Collar axial width must exceed clamp screw diameter",
    })
  }
}
