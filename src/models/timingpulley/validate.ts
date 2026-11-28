import type { z } from "zod"

export interface TimingPulleyShape {
  teeth: number
  pitch: number
  boreDiameter: number
  width: number
  htd5m: true
  setScrew: true
  thread: string
}

export function validateTimingPulleyProps(
  p: TimingPulleyShape,
  ctx: z.RefinementCtx,
): void {
  if (Math.abs(p.pitch - 5) > 1e-6) {
    ctx.addIssue({
      code: "custom",
      path: ["pitch"],
      message: "HTD 5M pulley profile requires a 5 mm tooth pitch",
    })
  }
  const pitchDiameter = (p.teeth * p.pitch) / Math.PI
  const outerDiameter = pitchDiameter - 1.14
  const rootDiameter = outerDiameter - 2 * 2.06
  if (p.boreDiameter + 2 >= rootDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Shaft bore leaves insufficient radial wall below tooth roots",
    })
  }
  const threadDia = Number(p.thread.slice(1))
  if (threadDia >= p.width) {
    ctx.addIssue({
      code: "custom",
      path: ["thread"],
      message: "Set-screw thread diameter must be smaller than pulley width",
    })
  }
}
