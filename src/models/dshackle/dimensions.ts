import {
  type DShackleModelPropsInput,
  dShackleModelPropsSchema,
} from "./schema"

export function getDShackleDimensions(input: DShackleModelPropsInput = {}) {
  const p = dShackleModelPropsSchema.parse(input)
  return {
    ...p,
    straightLegLength: p.innerHeight - p.crownRadius,
  }
}
