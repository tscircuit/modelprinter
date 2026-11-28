import {
  type TSlotGantryPlateModelPropsInput,
  tSlotGantryPlateModelPropsSchema,
} from "./schema"

/** Resolved gantry plate bounds, fixed axle centers and eccentric seats in mm. */
export function getTSlotGantryPlateDimensions(
  input: TSlotGantryPlateModelPropsInput = {},
) {
  const props = tSlotGantryPlateModelPropsSchema.parse(input)
  const halfSpacing = props.wheelSpacing * 0.5
  const minSideMargin =
    (props.width - props.wheelSpacing - props.eccentricDiameter) * 0.5
  const minEdgeMargin =
    (props.height - props.wheelSpacing - props.eccentricDiameter) * 0.5
  return {
    ...props,
    minSideMargin,
    minEdgeMargin,
    fixedAxleCenters: [
      [-halfSpacing, halfSpacing],
      [halfSpacing, halfSpacing],
    ] as [[number, number], [number, number]],
    eccentricAxleCenters: [
      [-halfSpacing, -halfSpacing],
      [halfSpacing, -halfSpacing],
    ] as [[number, number], [number, number]],
    bottomZ: 0,
    topZ: props.thickness,
    size: [props.width, props.height, props.thickness] as [
      number,
      number,
      number,
    ],
  }
}
