import type { z } from "zod"

export interface BallScrewShape {
  diameter: number
  length: number
  pitch: number
  gothicArch: true
  handedness: "right" | "left"
  starts: number
  endJournalDiameter: number
  endJournalLength: number
}

export function validateBallScrewProps(
  p: BallScrewShape,
  ctx: z.RefinementCtx,
): void {
  if (p.endJournalDiameter >= p.diameter - 1) {
    ctx.addIssue({
      code: "custom",
      path: ["endJournalDiameter"],
      message:
        "Reduced end support journal diameter must be smaller than screw diameter",
    })
  }
  if (2 * p.endJournalLength >= p.length) {
    ctx.addIssue({
      code: "custom",
      path: ["endJournalLength"],
      message: "Paired end journals leave no central threaded raceway length",
    })
  }
  if (p.pitch >= p.diameter * 2) {
    ctx.addIssue({
      code: "custom",
      path: ["pitch"],
      message: "Ball raceway pitch exceeds valid proportion for screw diameter",
    })
  }
}
