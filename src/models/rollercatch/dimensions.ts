import {
  type RollerCatchModelPropsInput,
  rollerCatchModelPropsSchema,
} from "./schema"

export function getRollerCatchDimensions(
  input: RollerCatchModelPropsInput = {},
) {
  const p = rollerCatchModelPropsSchema.parse(input)
  return {
    ...p,
    strikeInterference: p.strikeWidth - p.rollerGap,
  }
}
