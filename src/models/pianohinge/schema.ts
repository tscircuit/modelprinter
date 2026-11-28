import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validatePianoHingeProps } from "./validate"

const shape = {
  openWidth: positive.default(30),
  length: positive.default(200),
  leafThickness: positive.default(1),
  pinDiameter: positive.default(3),
  knuckleLength: positive.default(10),
  holeDiameter: positive.default(3),
  holePitch: positive.default(40),
  rows: z.literal(2).default(2),
  openAngle: z.literal(180).default(180),
  holes: z.number().int().min(4).max(100).default(10),
  endOffset: positive.default(20),
}

export const pianoHingeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePianoHingeProps)

export const pianoHingeModelDefinitionSchema = z
  .object({ fn: z.literal("pianohinge"), ...shape })
  .strict()
  .superRefine(validatePianoHingeProps)

export type PianoHingeModelPropsInput = z.input<
  typeof pianoHingeModelPropsSchema
>
export type PianoHingeModelProps = z.output<typeof pianoHingeModelPropsSchema>
export type PianoHingeModelDefinition = z.output<
  typeof pianoHingeModelDefinitionSchema
>
