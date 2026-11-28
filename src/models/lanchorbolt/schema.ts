import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateLAnchorBoltProps } from "./validate"

const shape = {
  threadDiameter: positive.default(10),
  length: positive.default(150),
  legLength: positive.default(40),
  bendRadius: positive.default(10),
  threadLength: positive.default(40),
  bendAngle: z.literal(90).default(90),
}

export const lAnchorBoltModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateLAnchorBoltProps)

export const lAnchorBoltModelDefinitionSchema = z
  .object({ fn: z.literal("lanchorbolt"), ...shape })
  .strict()
  .superRefine(validateLAnchorBoltProps)

export type LAnchorBoltModelPropsInput = z.input<
  typeof lAnchorBoltModelPropsSchema
>
export type LAnchorBoltModelProps = z.output<typeof lAnchorBoltModelPropsSchema>
export type LAnchorBoltModelDefinition = z.output<
  typeof lAnchorBoltModelDefinitionSchema
>
