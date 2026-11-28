import {
  type ReedCapsuleModelPropsInput,
  reedCapsuleModelPropsSchema,
} from "./schema"

export function getReedCapsuleDimensions(
  input: ReedCapsuleModelPropsInput = {},
) {
  const p = reedCapsuleModelPropsSchema.parse(input)
  const overallSpan = p.bodyLength + 2 * p.leadLength
  return {
    ...p,
    overallSpan,
    bottomZ: -p.outerDiameter / 2,
    topZ: p.outerDiameter / 2,
  }
}
