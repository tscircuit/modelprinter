import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizePlowBoltProps } from "./normalize"
import { validatePlowBoltProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m8"),
  length: positive.default(35),
  threadLength: positive.default(22),
  headOuterDiameter: positive.default(18),
  headAngleDeg: z.number().finite().gt(0).lt(180).default(90),
  squareNeck: z.literal(true).default(true),
  neckWidth: positive.default(8),
  neckLength: positive.default(5),
}

export const plowBoltModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePlowBoltProps)
  .transform(normalizePlowBoltProps)

export const plowBoltModelDefinitionSchema = z
  .object({ fn: z.literal("plowbolt"), ...shape })
  .strict()
  .superRefine(validatePlowBoltProps)
  .transform(normalizePlowBoltProps)

export type PlowBoltModelPropsInput = z.input<typeof plowBoltModelPropsSchema>
export type PlowBoltModelProps = z.output<typeof plowBoltModelPropsSchema>
export type PlowBoltModelDefinition = z.output<
  typeof plowBoltModelDefinitionSchema
>
