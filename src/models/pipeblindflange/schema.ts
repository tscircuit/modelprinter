import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validatePipeBlindFlangeProps } from "./validate"

const shape = {
  outerDiameter: positive.default(95),
  thickness: positive.default(12),
  boltCircleDiameter: positive.default(65),
  holes: z.number().int().min(3).max(24).default(4),
  holeDiameter: positive.default(9),
  flatFace: z.literal(true).default(true),
  solidCenter: z.literal(true).default(true),
}

export const pipeBlindFlangeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePipeBlindFlangeProps)

export const pipeBlindFlangeModelDefinitionSchema = z
  .object({ fn: z.literal("pipeblindflange"), ...shape })
  .strict()
  .superRefine(validatePipeBlindFlangeProps)

export type PipeBlindFlangeModelPropsInput = z.input<
  typeof pipeBlindFlangeModelPropsSchema
>
export type PipeBlindFlangeModelProps = z.output<
  typeof pipeBlindFlangeModelPropsSchema
>
export type PipeBlindFlangeModelDefinition = z.output<
  typeof pipeBlindFlangeModelDefinitionSchema
>
