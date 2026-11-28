import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTSlotFloorBracketProps } from "./validate"

const shape = {
  width: positive.default(60),
  depth: positive.default(50),
  height: positive.default(70),
  thickness: positive.default(5),
  ribs: z.number().int().min(1).max(4).default(2),
  ribThickness: positive.default(4),
  holeDiameter: positive.default(6),
  baseHolePitch: positive.default(40),
  wallHolePitch: positive.default(40),
}

export const tSlotFloorBracketModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTSlotFloorBracketProps)

export const tSlotFloorBracketModelDefinitionSchema = z
  .object({ fn: z.literal("tslotfloorbracket"), ...shape })
  .strict()
  .superRefine(validateTSlotFloorBracketProps)

export type TSlotFloorBracketModelPropsInput = z.input<
  typeof tSlotFloorBracketModelPropsSchema
>
export type TSlotFloorBracketModelProps = z.output<
  typeof tSlotFloorBracketModelPropsSchema
>
export type TSlotFloorBracketModelDefinition = z.output<
  typeof tSlotFloorBracketModelDefinitionSchema
>
