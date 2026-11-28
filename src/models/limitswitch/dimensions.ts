import {
  type LimitSwitchModelPropsInput,
  limitSwitchModelPropsSchema,
} from "./schema"

export function getLimitSwitchDimensions(
  input: LimitSwitchModelPropsInput = {},
) {
  const p = limitSwitchModelPropsSchema.parse(input)
  return {
    ...p,
    totalActuatorReach: p.leverLength + p.rollerOuterDiameter / 2,
  }
}
