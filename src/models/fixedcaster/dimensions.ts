import {
  type FixedCasterModelPropsInput,
  fixedCasterModelPropsSchema,
} from "./schema"

/** Resolved rigid-fork fixed caster bounds, axle height and plate holes in mm. */
export function getFixedCasterDimensions(
  input: FixedCasterModelPropsInput = {},
) {
  const props = fixedCasterModelPropsSchema.parse(input)
  const [gridX, gridY] = props.holeGrid
  const plateThickness = Math.max(2.5, props.wheelDiameter * 0.06)
  const crownClearance = Math.max(4, props.wheelDiameter * 0.12)
  const overallHeight = props.wheelDiameter + crownClearance + plateThickness
  const axleCenterZ = props.wheelDiameter * 0.5
  return {
    ...props,
    plateThickness,
    crownClearance,
    overallHeight,
    axleCenterZ,
    holeCenters: [
      [-gridX * 0.5, -gridY * 0.5],
      [gridX * 0.5, -gridY * 0.5],
      [-gridX * 0.5, gridY * 0.5],
      [gridX * 0.5, gridY * 0.5],
    ] as [
      [number, number],
      [number, number],
      [number, number],
      [number, number],
    ],
    floorZ: 0,
    plateTopZ: overallHeight,
    size: [
      Math.max(props.plateWidth, props.wheelDiameter),
      props.plateHeight,
      overallHeight,
    ] as [number, number, number],
  }
}
