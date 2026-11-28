import {
  type LowHeadSocketModelPropsInput,
  lowHeadSocketModelPropsSchema,
} from "./schema"
import { findDin7984Spec } from "./table"

export function getLowHeadSocketDimensions(
  input: LowHeadSocketModelPropsInput,
) {
  const p = lowHeadSocketModelPropsSchema.parse(input)
  const spec = findDin7984Spec(p.thread)
  if (!spec) {
    throw new Error(`Missing DIN 7984 spec for "${p.thread}"`)
  }
  return {
    ...p,
    majorDiameter: spec.majorDiameter,
    threadPitch: spec.threadPitch,
    headDiameter: spec.headDiameter,
    headHeight: spec.headHeight,
    socketAcrossFlats: spec.socketAcrossFlats,
    socketDepth: spec.socketDepth,
    overallLength: p.length + spec.headHeight,
    bottomZ: -p.length,
    topZ: spec.headHeight,
  }
}
