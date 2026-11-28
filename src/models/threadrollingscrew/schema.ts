import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeThreadRollingScrewProps } from "./normalize"
import { validateThreadRollingScrewProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m4"),
  length: positive.default(16),
  panHead: z.literal(true).default(true),
  headOuterDiameter: positive.default(7),
  headHeight: positive.default(2.6),
  phillips: z.literal(true).default(true),
  trilobular: z.literal(true).default(true),
  lobes: z.literal(3).default(3),
  lobingOffset: positive.default(0.25),
  leadLength: positive.default(2),
  taperTip: z.literal(true).default(true),
}

export const threadRollingScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateThreadRollingScrewProps)
  .transform(normalizeThreadRollingScrewProps)

export const threadRollingScrewModelDefinitionSchema = z
  .object({ fn: z.literal("threadrollingscrew"), ...shape })
  .strict()
  .superRefine(validateThreadRollingScrewProps)
  .transform(normalizeThreadRollingScrewProps)

export type ThreadRollingScrewModelPropsInput = z.input<
  typeof threadRollingScrewModelPropsSchema
>
export type ThreadRollingScrewModelProps = z.output<
  typeof threadRollingScrewModelPropsSchema
>
export type ThreadRollingScrewModelDefinition = z.output<
  typeof threadRollingScrewModelDefinitionSchema
>
