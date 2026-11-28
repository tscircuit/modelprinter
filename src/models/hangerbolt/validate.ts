import type { z } from "zod"

export interface HangerBoltShape {
  custom: true
  thread: string
  length: number
  machineThreadLength: number
  woodDiameter: number
  woodThreadPitch: number
  woodThreadLength: number
  centerFlats: true
  flats: number
  acrossFlats: number
  flatLength: number
  coneTip: true
}

export function validateHangerBoltProps(
  p: HangerBoltShape,
  ctx: z.RefinementCtx,
): void {
  const majorDia = Number(p.thread.slice(1))
  if (p.acrossFlats >= majorDia) {
    ctx.addIssue({
      code: "custom",
      path: ["acrossFlats"],
      message:
        "Recessed center wrench across-flats must be smaller than shank OD",
    })
  }
  if (p.machineThreadLength + p.woodThreadLength > p.length + 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["length"],
      message:
        "Machine and wood thread lengths exceed overall hanger bolt length",
    })
  }
}
