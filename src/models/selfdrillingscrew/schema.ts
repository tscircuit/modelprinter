import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSelfDrillingScrewProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  diameter: positive.default(4.2),
  coreDiameter: positive.default(3.1),
  threadPitch: positive.default(1.4),
  rightHanded: z.boolean().default(true),
  length: positive.default(19),
  threadLength: positive.default(14),
  hexFlange: z.literal(true).default(true),
  acrossFlats: positive.default(7),
  headHeight: positive.default(4),
  flangeOuterDiameter: positive.default(9.5),
  drillLength: positive.default(5),
  flutes: z.number().int().min(1).max(4).default(2),
  pointAngle: z.number().finite().gt(60).lt(160).default(118),
}

export const selfDrillingScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSelfDrillingScrewProps)

export const selfDrillingScrewModelDefinitionSchema = z
  .object({ fn: z.literal("selfdrillingscrew"), ...shape })
  .strict()
  .superRefine(validateSelfDrillingScrewProps)

export type SelfDrillingScrewModelPropsInput = z.input<
  typeof selfDrillingScrewModelPropsSchema
>
export type SelfDrillingScrewModelProps = z.output<
  typeof selfDrillingScrewModelPropsSchema
>
export type SelfDrillingScrewModelDefinition = z.output<
  typeof selfDrillingScrewModelDefinitionSchema
>
