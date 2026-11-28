import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFlangeBoxProps } from "./validate"

const shape = {
  width: positive.default(120),
  depth: positive.default(80),
  height: positive.default(45),
  wallThickness: positive.default(2),
  flangeProjection: positive.default(12),
  flangeThickness: positive.default(3),
  flangeHoles: z.literal(4).default(4),
  flangeHoleDiameter: positive.default(4),
  holePitchX: positive.default(136),
  holePitchY: positive.default(56),
  screwOnLid: z.literal(true).default(true),
  lidScrews: z.literal(4).default(4),
}

export const flangeBoxModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFlangeBoxProps)

export const flangeBoxModelDefinitionSchema = z
  .object({ fn: z.literal("flangebox"), ...shape })
  .strict()
  .superRefine(validateFlangeBoxProps)

export type FlangeBoxModelPropsInput = z.input<typeof flangeBoxModelPropsSchema>
export type FlangeBoxModelProps = z.output<typeof flangeBoxModelPropsSchema>
export type FlangeBoxModelDefinition = z.output<
  typeof flangeBoxModelDefinitionSchema
>
