import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateDovetailMountingRailProps } from "./validate"

const shape = {
  baseWidth: positive.default(60),
  baseThickness: positive.default(8),
  length: positive.default(200),
  headWidth: positive.default(40),
  neckWidth: positive.default(26.144),
  dovetailHeight: positive.default(12),
  dovetailAngle: z.number().gt(0).max(80).default(60),
  holes: z.number().int().min(2).max(12).default(3),
  holeDiameter: positive.default(8.5),
  holePitch: positive.default(75),
  endMargin: positive.default(25),
  counterboreDiameter: positive.default(14),
  counterboreDepth: positive.default(5),
}

export const dovetailMountingRailModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateDovetailMountingRailProps)

export const dovetailMountingRailModelDefinitionSchema = z
  .object({ fn: z.literal("dovetailmountingrail"), ...shape })
  .strict()
  .superRefine(validateDovetailMountingRailProps)

export type DovetailMountingRailModelPropsInput = z.input<
  typeof dovetailMountingRailModelPropsSchema
>
export type DovetailMountingRailModelProps = z.output<
  typeof dovetailMountingRailModelPropsSchema
>
export type DovetailMountingRailModelDefinition = z.output<
  typeof dovetailMountingRailModelDefinitionSchema
>
