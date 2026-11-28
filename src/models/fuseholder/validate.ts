import type { z } from "zod"

export interface FuseHolderShape {
  fuseDiameter: number
  fuseLength: number
  panelHoleDiameter: number
  thread: string
  threadPitch: number
  bodyLength: number
  capOuterDiameter: number
  panelBayonet: true
}

export function validateFuseHolderProps(
  p: FuseHolderShape,
  ctx: z.RefinementCtx,
): void {
  const threadNominal = Number(p.thread.slice(1))
  if (
    !Number.isFinite(threadNominal) ||
    Math.abs(threadNominal - p.panelHoleDiameter) > 1.5
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["thread"],
      message:
        "Panel thread nominal diameter must match the panel cutout diameter within mounting clearance",
    })
  }
  if (p.fuseDiameter >= p.panelHoleDiameter - 2 * p.threadPitch) {
    ctx.addIssue({
      code: "custom",
      path: ["fuseDiameter"],
      message:
        "Cartridge fuse diameter must fit inside the threaded panel barrel bore",
    })
  }
  if (p.capOuterDiameter <= p.panelHoleDiameter) {
    ctx.addIssue({
      code: "custom",
      path: ["capOuterDiameter"],
      message:
        "Bayonet cap flange outer diameter must exceed the panel cutout diameter",
    })
  }
  if (p.bodyLength <= p.fuseLength) {
    ctx.addIssue({
      code: "custom",
      path: ["bodyLength"],
      message: "Holder barrel length must exceed the cartridge fuse length",
    })
  }
}
