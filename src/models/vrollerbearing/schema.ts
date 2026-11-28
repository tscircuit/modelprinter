import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateVRollerBearingProps } from "./validate"

const shape = {
  boreDiameter: positive.default(5),
  outerDiameter: positive.default(24),
  width: positive.default(10),
  grooveAngle: z.number().min(60).max(120).default(90),
  grooveDepth: positive.default(3),
  vGroove: z.literal(true).default(true),
  boreMount: z.literal(true).default(true),
}

export const vRollerBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateVRollerBearingProps)

export const vRollerBearingModelDefinitionSchema = z
  .object({ fn: z.literal("vrollerbearing"), ...shape })
  .strict()
  .superRefine(validateVRollerBearingProps)

export type VRollerBearingModelPropsInput = z.input<
  typeof vRollerBearingModelPropsSchema
>
export type VRollerBearingModelProps = z.output<
  typeof vRollerBearingModelPropsSchema
>
export type VRollerBearingModelDefinition = z.output<
  typeof vRollerBearingModelDefinitionSchema
>
