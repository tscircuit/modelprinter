import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateYokeFollowerProps } from "./validate"

const shape = {
  boreDiameter: positive.default(10),
  outerDiameter: positive.default(30),
  width: positive.default(14),
  rows: z.number().int().min(1).max(2).default(1),
  needleBearing: z.literal(true).default(true),
  closure: z.enum(["open", "shielded", "sealed"]).default("open"),
  boreMount: z.literal(true).default(true),
}

export const yokeFollowerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateYokeFollowerProps)

export const yokeFollowerModelDefinitionSchema = z
  .object({ fn: z.literal("yokefollower"), ...shape })
  .strict()
  .superRefine(validateYokeFollowerProps)

export type YokeFollowerModelPropsInput = z.input<
  typeof yokeFollowerModelPropsSchema
>
export type YokeFollowerModelProps = z.output<
  typeof yokeFollowerModelPropsSchema
>
export type YokeFollowerModelDefinition = z.output<
  typeof yokeFollowerModelDefinitionSchema
>
