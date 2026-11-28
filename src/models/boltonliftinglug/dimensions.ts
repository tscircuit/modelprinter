import {
  type BoltOnLiftingLugModelPropsInput,
  boltOnLiftingLugModelPropsSchema,
} from "./schema"

export function getBoltOnLiftingLugDimensions(
  input: BoltOnLiftingLugModelPropsInput = {},
) {
  const p = boltOnLiftingLugModelPropsSchema.parse(input)
  return {
    ...p,
    eyeCrownLigament: p.topRadius - p.eyeDiameter / 2,
    baseZ: 0,
    topZ: p.eyeZ + p.topRadius,
  }
}
