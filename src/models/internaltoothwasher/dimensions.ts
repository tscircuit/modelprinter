import {
  type InternalToothWasherModelPropsInput,
  internalToothWasherModelPropsSchema,
} from "./schema"

export function getInternalToothWasherDimensions(
  input: InternalToothWasherModelPropsInput = {},
) {
  const p = internalToothWasherModelPropsSchema.parse(input)
  return {
    ...p,
    toothRadialLength: (p.rootInnerDiameter - p.innerDiameter) / 2,
    outerRingRadialWidth: (p.outerDiameter - p.rootInnerDiameter) / 2,
  }
}
