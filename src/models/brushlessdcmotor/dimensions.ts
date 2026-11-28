import { hexSocketBoltDimensions } from "../../hex-socket-bolt-schema"
import {
  type BrushlessDcMotorModelPropsInput,
  brushlessDcMotorModelPropsSchema,
} from "./schema"

/** Resolved outrunner brushless DC motor envelope and four-hole coordinates in mm. */
export function getBrushlessDcMotorDimensions(
  input: BrushlessDcMotorModelPropsInput = {},
) {
  const props = brushlessDcMotorModelPropsSchema.parse(input)
  const mountThreadDiameter = hexSocketBoltDimensions[props.metricSize].diameter
  const mountThreadDepth = 1.5 * mountThreadDiameter
  const overallLength = props.length + props.shaftLength
  const radius = props.boltPitchCircleDiameter * 0.5
  return {
    ...props,
    mountThreadDiameter,
    mountThreadDepth,
    overallLength,
    mountHoleCenters: [
      [radius, 0],
      [0, radius],
      [-radius, 0],
      [0, -radius],
    ] as [
      [number, number],
      [number, number],
      [number, number],
      [number, number],
    ],
    rearZ: -props.length,
    mountingFaceZ: 0,
    shaftTipZ: props.shaftLength,
    size: [props.outerDiameter, props.outerDiameter, overallLength] as [
      number,
      number,
      number,
    ],
  }
}
