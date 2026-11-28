import type { z } from "zod"

export interface ToggleControlShape {
  bodyLength: number
  bodyWidth: number
  bodyHeight: number
  thread: string
  threadPitch: number
  bushingLength: number
  leverLength: number
  contacts: 2 | 3 | 6
  solderLug: true
  verticalLever: true
}

export function validateToggleControlProps(
  p: ToggleControlShape,
  ctx: z.RefinementCtx,
): void {
  const bushingNominal = Number(p.thread.slice(1))
  if (
    !Number.isFinite(bushingNominal) ||
    bushingNominal <= 0 ||
    bushingNominal >= Math.min(p.bodyLength, p.bodyWidth)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["thread"],
      message:
        "Threaded bushing nominal diameter must fit within the switch body footprint",
    })
  }
  if (p.threadPitch >= bushingNominal * 0.4) {
    ctx.addIssue({
      code: "custom",
      path: ["threadPitch"],
      message: "Bushing thread pitch must remain finer than the nominal thread",
    })
  }
}
