import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeJackScrewProps } from "./normalize"
import { validateJackScrewProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m8"),
  length: positive.default(40),
  fullThread: z.literal(true).default(true),
  headAcrossFlats: positive.default(13),
  headHeight: positive.default(5),
  padOuterDiameter: positive.default(15),
  padHeight: positive.default(4),
  ballJoint: z.literal(true).default(true),
  ballDiameter: positive.default(6),
}

export const jackScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateJackScrewProps)
  .transform(normalizeJackScrewProps)

export const jackScrewModelDefinitionSchema = z
  .object({ fn: z.literal("jackscrew"), ...shape })
  .strict()
  .superRefine(validateJackScrewProps)
  .transform(normalizeJackScrewProps)

export type JackScrewModelPropsInput = z.input<typeof jackScrewModelPropsSchema>
export type JackScrewModelProps = z.output<typeof jackScrewModelPropsSchema>
export type JackScrewModelDefinition = z.output<
  typeof jackScrewModelDefinitionSchema
>
