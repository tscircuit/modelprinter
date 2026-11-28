import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateLagScrewProps } from "./validate"

const shape = {
  custom: z.literal(true).default(true),
  diameter: positive.default(6),
  coreDiameter: positive.default(4.2),
  length: positive.default(40),
  threadLength: positive.default(26),
  threadPitch: positive.default(2.6),
  rightHanded: z.boolean().default(true),
  acrossFlats: positive.default(10),
  headHeight: positive.default(4),
  hexHead: z.literal(true).default(true),
  hexDrive: z.literal(true).default(true),
  coneTip: z.literal(true).default(true),
}

export const lagScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateLagScrewProps)

export const lagScrewModelDefinitionSchema = z
  .object({ fn: z.literal("lagscrew"), ...shape })
  .strict()
  .superRefine(validateLagScrewProps)

export type LagScrewModelPropsInput = z.input<typeof lagScrewModelPropsSchema>
export type LagScrewModelProps = z.output<typeof lagScrewModelPropsSchema>
export type LagScrewModelDefinition = z.output<
  typeof lagScrewModelDefinitionSchema
>
