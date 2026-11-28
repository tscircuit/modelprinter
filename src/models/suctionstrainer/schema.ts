import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSuctionStrainerProps } from "./validate"

const shape = {
  portNominal: positive.default(12.7),
  outerDiameter: positive.default(45),
  length: positive.default(80),
  perforationDiameter: positive.default(3),
  perforationPitch: positive.default(5),
  cylindrical: z.boolean().default(true),
  flatCap: z.boolean().default(true),
}

export const suctionStrainerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSuctionStrainerProps)

export const suctionStrainerModelDefinitionSchema = z
  .object({ fn: z.literal("suctionstrainer"), ...shape })
  .strict()
  .superRefine(validateSuctionStrainerProps)

export type SuctionStrainerModelPropsInput = z.input<
  typeof suctionStrainerModelPropsSchema
>
export type SuctionStrainerModelProps = z.output<
  typeof suctionStrainerModelPropsSchema
>
export type SuctionStrainerModelDefinition = z.output<
  typeof suctionStrainerModelDefinitionSchema
>
