import type { z } from "zod"

export interface FixedCasterShapeOutput {
  wheelDiameter: number
  wheelWidth: number
  plateWidth: number
  plateHeight: number
  plate4Hole: true
  holeGrid: [number, number]
  holeDiameter: number
}

export function validateFixedCasterProps(
  props: FixedCasterShapeOutput,
  context: z.RefinementCtx,
) {
  const [gridX, gridY] = props.holeGrid
  if (
    !Number.isFinite(
      props.wheelDiameter *
        props.wheelWidth *
        props.plateWidth *
        props.plateHeight,
    )
  ) {
    context.addIssue({
      code: "custom",
      path: ["wheelDiameter"],
      message: "Fixed caster envelope dimensions must be finite",
    })
    return
  }
  if (props.wheelWidth >= props.plateHeight) {
    context.addIssue({
      code: "custom",
      path: ["wheelWidth"],
      message:
        "Top mounting plate transverse width must exceed wheel width for rigid fork legs",
    })
  }
  if (gridX <= props.holeDiameter || gridY <= props.holeDiameter) {
    context.addIssue({
      code: "custom",
      path: ["holeGrid"],
      message: "Four-hole mounting grid spacings must exceed hole diameter",
    })
  }
  if (
    gridX + props.holeDiameter >= props.plateWidth ||
    gridY + props.holeDiameter >= props.plateHeight
  ) {
    context.addIssue({
      code: "custom",
      path: ["holeGrid"],
      message:
        "Four-hole mounting grid must leave positive margins inside the top plate",
    })
  }
}
