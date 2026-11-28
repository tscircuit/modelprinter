import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validatePlasticWallPlugProps } from "./validate"

const shape = {
  outerDiameter: positive.default(6),
  length: positive.default(30),
  boreDiameter: positive.default(3),
  slots: z.number().int().min(2).max(4).default(2),
  slotLength: positive.default(20),
  ribs: z.number().int().min(2).max(12).default(6),
  ribHeight: positive.default(0.5),
  ribPitch: positive.default(4),
  flangeOuterDiameter: positive.default(8),
  flangeHeight: positive.default(1),
  unset: z.literal(true).default(true),
}

export const plasticWallPlugModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validatePlasticWallPlugProps)

export const plasticWallPlugModelDefinitionSchema = z
  .object({ fn: z.literal("plasticwallplug"), ...shape })
  .strict()
  .superRefine(validatePlasticWallPlugProps)

export type PlasticWallPlugModelPropsInput = z.input<
  typeof plasticWallPlugModelPropsSchema
>
export type PlasticWallPlugModelProps = z.output<
  typeof plasticWallPlugModelPropsSchema
>
export type PlasticWallPlugModelDefinition = z.output<
  typeof plasticWallPlugModelDefinitionSchema
>
