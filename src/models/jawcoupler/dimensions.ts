import { hexSocketBoltDimensions } from "../../hex-socket-bolt-schema"
import {
  type JawCouplerModelPropsInput,
  jawCouplerModelPropsSchema,
} from "./schema"

/** Resolved three-part curved-jaw shaft coupling dimensions in mm. */
export function getJawCouplerDimensions(input: JawCouplerModelPropsInput = {}) {
  const props = jawCouplerModelPropsSchema.parse(input)
  const setScrewDiameter = hexSocketBoltDimensions[props.metricSize].diameter
  const spiderLength = props.length * 0.25
  const hubBaseLength = props.length * 0.375
  const setScrewZOffset = hubBaseLength * 0.5
  return {
    ...props,
    spiderLobeCount: props.jawCount * 2,
    spiderLength,
    hubBaseLength,
    setScrewDiameter,
    setScrewPositionsZ: [setScrewZOffset, props.length - setScrewZOffset] as [
      number,
      number,
    ],
    bottomZ: 0,
    topZ: props.length,
    size: [props.outerDiameter, props.outerDiameter, props.length] as [
      number,
      number,
      number,
    ],
  }
}
