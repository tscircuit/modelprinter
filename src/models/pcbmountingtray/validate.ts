import type { z } from "zod"

export interface MountingTrayShapeOutput {
  width: number
  depth: number
  height: number
  wallThickness: number
  bossOuterDiameter: number
  bossInnerDiameter: number
  bossHeight: number
  holePattern: [number, number]
  earCount: 2
}

export function validatePcbMountingTrayProps(
  props: MountingTrayShapeOutput,
  context: z.RefinementCtx,
) {
  const [pitchX, pitchY] = props.holePattern
  if (
    !Number.isFinite(props.width * props.depth * props.height * pitchX * pitchY)
  ) {
    context.addIssue({
      code: "custom",
      path: ["width"],
      message: "PCB mounting tray envelope dimensions must be finite",
    })
    return
  }
  if (2 * props.wallThickness >= Math.min(props.width, props.depth)) {
    context.addIssue({
      code: "custom",
      path: ["wallThickness"],
      message: "Wall thickness must leave an open interior PCB cavity",
    })
  }
  if (props.wallThickness >= props.height) {
    context.addIssue({
      code: "custom",
      path: ["height"],
      message: "Tray rim height must exceed floor thickness",
    })
  }
  if (props.bossInnerDiameter >= props.bossOuterDiameter) {
    context.addIssue({
      code: "custom",
      path: ["bossInnerDiameter"],
      message: "Boss bore diameter must be smaller than boss outer diameter",
    })
  }
  if (props.wallThickness + props.bossHeight > props.height) {
    context.addIssue({
      code: "custom",
      path: ["bossHeight"],
      message: "Corner PCB standoff bosses must not exceed tray rim height",
    })
  }
  if (pitchX <= props.bossOuterDiameter || pitchY <= props.bossOuterDiameter) {
    context.addIssue({
      code: "custom",
      path: ["holePattern"],
      message:
        "Corner boss hole pattern pitches must exceed boss outer diameter",
    })
  }
  const innerWidth = props.width - 2 * props.wallThickness
  const innerDepth = props.depth - 2 * props.wallThickness
  if (
    pitchX + props.bossOuterDiameter > innerWidth ||
    pitchY + props.bossOuterDiameter > innerDepth
  ) {
    context.addIssue({
      code: "custom",
      path: ["holePattern"],
      message: "Corner PCB support bosses must fit inside the interior walls",
    })
  }
}
