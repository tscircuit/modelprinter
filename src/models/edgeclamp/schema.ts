import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateEdgeClampProps } from "./validate"

const shape = {
  length: positive.default(50),
  width: positive.default(30),
  height: positive.default(20),
  jawTravel: positive.default(5),
  jawWidth: positive.default(25),
  jawHeight: positive.default(12),
  holes: z.number().int().min(1).max(6).default(2),
  holeDiameter: positive.default(6.6),
  holePitch: positive.default(30),
  driveThreadDiameter: positive.default(6),
}

export const edgeClampModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateEdgeClampProps)

export const edgeClampModelDefinitionSchema = z
  .object({ fn: z.literal("edgeclamp"), ...shape })
  .strict()
  .superRefine(validateEdgeClampProps)

export type EdgeClampModelPropsInput = z.input<typeof edgeClampModelPropsSchema>
export type EdgeClampModelProps = z.output<typeof edgeClampModelPropsSchema>
export type EdgeClampModelDefinition = z.output<
  typeof edgeClampModelDefinitionSchema
>
