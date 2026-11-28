import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeSplitShaftCollarProps } from "./normalize"
import { validateSplitShaftCollarProps } from "./validate"

const shape = {
  boreDiameter: positive.default(20),
  outerDiameter: positive.default(40),
  width: positive.default(12),
  twoPieceClamp: z.literal(true).default(true),
  bolts: z.literal(2).default(2),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m5"),
}

export const splitShaftCollarModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSplitShaftCollarProps)
  .transform(normalizeSplitShaftCollarProps)

export const splitShaftCollarModelDefinitionSchema = z
  .object({ fn: z.literal("splitshaftcollar"), ...shape })
  .strict()
  .superRefine(validateSplitShaftCollarProps)
  .transform(normalizeSplitShaftCollarProps)

export type SplitShaftCollarModelPropsInput = z.input<
  typeof splitShaftCollarModelPropsSchema
>
export type SplitShaftCollarModelProps = z.output<
  typeof splitShaftCollarModelPropsSchema
>
export type SplitShaftCollarModelDefinition = z.output<
  typeof splitShaftCollarModelDefinitionSchema
>
