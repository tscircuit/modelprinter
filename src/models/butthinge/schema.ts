import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateButtHingeProps } from "./validate"

const shape = {
  openWidth: positive.default(40),
  length: positive.default(50),
  leafThickness: positive.default(2),
  pinDiameter: positive.default(4),
  knuckles: z.number().int().min(3).max(11).default(5),
  holes: z.union([z.literal(4), z.literal(6), z.literal(8)]).default(6),
  holeDiameter: positive.default(4),
  holePitchX: positive.default(24),
  holePitchY: positive.default(18),
  equalLeaf: z.literal(true).default(true),
  openAngle: z.literal(180).default(180),
}

export const buttHingeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateButtHingeProps)

export const buttHingeModelDefinitionSchema = z
  .object({ fn: z.literal("butthinge"), ...shape })
  .strict()
  .superRefine(validateButtHingeProps)

export type ButtHingeModelPropsInput = z.input<typeof buttHingeModelPropsSchema>
export type ButtHingeModelProps = z.output<typeof buttHingeModelPropsSchema>
export type ButtHingeModelDefinition = z.output<
  typeof buttHingeModelDefinitionSchema
>
