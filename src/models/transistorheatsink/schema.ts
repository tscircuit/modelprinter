import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTransistorHeatsinkProps } from "./validate"

const shape = {
  width: positive.default(25),
  height: positive.default(30),
  depth: positive.default(15),
  thickness: positive.default(1),
  uShapedWings: z.literal(true).default(true),
  deviceHoleDiameter: positive.default(3.2),
  holeZ: positive.default(10),
  tabs: z.literal(2).default(2),
  tabHoleDiameter: positive.default(3),
  holePitch: positive.default(20),
}

export const transistorHeatsinkModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTransistorHeatsinkProps)

export const transistorHeatsinkModelDefinitionSchema = z
  .object({ fn: z.literal("transistorheatsink"), ...shape })
  .strict()
  .superRefine(validateTransistorHeatsinkProps)

export type TransistorHeatsinkModelPropsInput = z.input<
  typeof transistorHeatsinkModelPropsSchema
>
export type TransistorHeatsinkModelProps = z.output<
  typeof transistorHeatsinkModelPropsSchema
>
export type TransistorHeatsinkModelDefinition = z.output<
  typeof transistorHeatsinkModelDefinitionSchema
>
