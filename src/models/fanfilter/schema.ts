import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFanFilterProps } from "./validate"

const shape = {
  width: positive.default(60),
  height: positive.default(60),
  depth: positive.default(8),
  frameThickness: positive.default(2),
  mediaWidth: positive.default(46),
  mediaHeight: positive.default(46),
  mediaThickness: positive.default(3),
  grillePitch: positive.default(6),
  holeDiameter: positive.default(4),
  holePitchX: positive.default(50),
  holePitchY: positive.default(50),
}

export const fanFilterModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFanFilterProps)

export const fanFilterModelDefinitionSchema = z
  .object({ fn: z.literal("fanfilter"), ...shape })
  .strict()
  .superRefine(validateFanFilterProps)

export type FanFilterModelPropsInput = z.input<typeof fanFilterModelPropsSchema>
export type FanFilterModelProps = z.output<typeof fanFilterModelPropsSchema>
export type FanFilterModelDefinition = z.output<
  typeof fanFilterModelDefinitionSchema
>
