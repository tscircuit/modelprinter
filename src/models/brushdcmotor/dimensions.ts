import { hexSocketBoltDimensions } from "../../hex-socket-bolt-schema"
import {
  type BrushDcMotorModelPropsInput,
  brushDcMotorModelPropsSchema,
} from "./schema"

/** Resolved round-can brushed DC motor envelope and front hole centers in mm. */
export function getBrushDcMotorDimensions(
  input: BrushDcMotorModelPropsInput = {},
) {
  const props = brushDcMotorModelPropsSchema.parse(input)
  const mountThreadDiameter = hexSocketBoltDimensions[props.metricSize].diameter
  const mountThreadDepth = 1.5 * mountThreadDiameter
  const overallLength = props.length + props.shaftLength
  const halfPcd = props.pitchCircleDiameter * 0.5
  return {
    ...props,
    mountThreadDiameter,
    mountThreadDepth,
    overallLength,
    mountHoleCenters: [
      [-halfPcd, 0],
      [halfPcd, 0],
    ] as [[number, number], [number, number]],
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
