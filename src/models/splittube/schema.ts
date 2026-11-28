import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSplitTubeProps } from "./validate"

const shape = {
  outerDiameter: positive.default(25),
  wallThickness: positive.default(2),
  length: positive.default(100),
  gapWidth: positive.default(3),
  chordGap: z.literal(true).default(true),
}

export const splitTubeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSplitTubeProps)

export const splitTubeModelDefinitionSchema = z
  .object({ fn: z.literal("splittube"), ...shape })
  .strict()
  .superRefine(validateSplitTubeProps)

export type SplitTubeModelPropsInput = z.input<typeof splitTubeModelPropsSchema>
export type SplitTubeModelProps = z.output<typeof splitTubeModelPropsSchema>
export type SplitTubeModelDefinition = z.output<
  typeof splitTubeModelDefinitionSchema
>
