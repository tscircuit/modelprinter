import {
  type BridgeHandleModelPropsInput,
  bridgeHandleModelPropsSchema,
} from "./schema"
import { bridgeHandleThreads } from "./table"

/** Resolved bridge handle envelope, clearance opening and rear hole centers in mm. */
export function getBridgeHandleDimensions(
  input: BridgeHandleModelPropsInput = {},
) {
  const props = bridgeHandleModelPropsSchema.parse(input)
  const [footLength, footWidth] = props.footSize
  const spec = bridgeHandleThreads[props.metricSize]
  const overallLength = props.pitch + footLength
  const overallWidth = Math.max(props.width, footWidth)
  const innerSpan = props.pitch - footLength
  const underGripClearance = props.height - props.gripThickness
  return {
    ...props,
    overallLength,
    overallWidth,
    innerSpan,
    underGripClearance,
    threadDiameter: spec.diameter,
    threadDepth: spec.threadDepth,
    holeCenters: [
      [-props.pitch * 0.5, 0],
      [props.pitch * 0.5, 0],
    ] as [[number, number], [number, number]],
    mountingZ: 0,
    topZ: props.height,
    size: [overallLength, overallWidth, props.height] as [
      number,
      number,
      number,
    ],
  }
}
