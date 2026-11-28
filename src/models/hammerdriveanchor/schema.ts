import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateHammerDriveAnchorProps } from "./validate"

const shape = {
  outerDiameter: positive.default(6),
  length: positive.default(40),
  headOuterDiameter: positive.default(12),
  headHeight: positive.default(2),
  pinDiameter: positive.default(2),
  pinExposed: positive.default(5),
  slots: z.number().int().min(2).max(4).default(2),
  slotLength: positive.default(15),
  unset: z.literal(true).default(true),
}

export const hammerDriveAnchorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateHammerDriveAnchorProps)

export const hammerDriveAnchorModelDefinitionSchema = z
  .object({ fn: z.literal("hammerdriveanchor"), ...shape })
  .strict()
  .superRefine(validateHammerDriveAnchorProps)

export type HammerDriveAnchorModelPropsInput = z.input<
  typeof hammerDriveAnchorModelPropsSchema
>
export type HammerDriveAnchorModelProps = z.output<
  typeof hammerDriveAnchorModelPropsSchema
>
export type HammerDriveAnchorModelDefinition = z.output<
  typeof hammerDriveAnchorModelDefinitionSchema
>
