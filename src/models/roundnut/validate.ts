import type { z } from "zod"

export interface RoundNutShape {
  custom: true
  thread: string
  outerDiameter: number
  height: number
  slots: number
  slotWidth: number
  slotDepth: number
  axialSlots: true
  throughBore: true
}

export function validateRoundNutProps(
  p: RoundNutShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  const rootRingDia = p.outerDiameter - 2 * p.slotDepth
  if (rootRingDia <= majorDia + 2) {
    ctx.addIssue({
      code: "custom",
      path: ["slotDepth"],
      message: "Spanner slots leave insufficient wall around internal thread",
    })
  }
  if (p.slots * p.slotWidth >= Math.PI * rootRingDia * 0.5) {
    ctx.addIssue({
      code: "custom",
      path: ["slotWidth"],
      message:
        "Total spanner slot width consumes more than half rim circumference",
    })
  }
}
