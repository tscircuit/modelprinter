import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateProngedTNutProps } from "./validate"

const shape = {
  threadDiameter: positive.default(6),
  barrelOuterDiameter: positive.default(8),
  length: positive.default(9),
  flangeOuterDiameter: positive.default(19),
  flangeHeight: positive.default(1),
  prongs: z.number().int().min(3).max(6).default(4),
  prongLength: positive.default(4),
  prongWidth: positive.default(2),
  pointedTip: z.literal(true).default(true),
}

export const prongedTNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateProngedTNutProps)

export const prongedTNutModelDefinitionSchema = z
  .object({ fn: z.literal("prongedtnut"), ...shape })
  .strict()
  .superRefine(validateProngedTNutProps)

export type ProngedTNutModelPropsInput = z.input<
  typeof prongedTNutModelPropsSchema
>
export type ProngedTNutModelProps = z.output<typeof prongedTNutModelPropsSchema>
export type ProngedTNutModelDefinition = z.output<
  typeof prongedTNutModelDefinitionSchema
>
