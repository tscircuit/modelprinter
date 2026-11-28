import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateVentPanelProps } from "./validate"

const shape = {
  width: positive.default(100),
  height: positive.default(60),
  thickness: positive.default(1),
  louvers: z.number().int().min(1).default(6),
  louverPitch: positive.default(8),
  slitWidth: positive.default(80),
  louverDepth: positive.default(3),
  holes: z.literal(4).default(4),
  holeDiameter: positive.default(3),
  holePitchX: positive.default(90),
  holePitchY: positive.default(50),
}

export const ventPanelModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateVentPanelProps)

export const ventPanelModelDefinitionSchema = z
  .object({ fn: z.literal("ventpanel"), ...shape })
  .strict()
  .superRefine(validateVentPanelProps)

export type VentPanelModelPropsInput = z.input<typeof ventPanelModelPropsSchema>
export type VentPanelModelProps = z.output<typeof ventPanelModelPropsSchema>
export type VentPanelModelDefinition = z.output<
  typeof ventPanelModelDefinitionSchema
>
