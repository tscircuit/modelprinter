import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateGuardPanelClampProps } from "./validate"

const shape = {
  width: positive.default(45),
  height: positive.default(30),
  parts: z.literal(2).default(2),
  partThickness: positive.default(12.5),
  grooveWidth: positive.default(5),
  grooveDepth: positive.default(2.5),
  holes: z.number().int().min(1).max(4).default(2),
  holeDiameter: positive.default(8.5),
  holePitch: positive.default(25),
  widthGroove: z.literal(true).default(true),
}

export const guardPanelClampModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateGuardPanelClampProps)

export const guardPanelClampModelDefinitionSchema = z
  .object({ fn: z.literal("guardpanelclamp"), ...shape })
  .strict()
  .superRefine(validateGuardPanelClampProps)

export type GuardPanelClampModelPropsInput = z.input<
  typeof guardPanelClampModelPropsSchema
>
export type GuardPanelClampModelProps = z.output<
  typeof guardPanelClampModelPropsSchema
>
export type GuardPanelClampModelDefinition = z.output<
  typeof guardPanelClampModelDefinitionSchema
>
