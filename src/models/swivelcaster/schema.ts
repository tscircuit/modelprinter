import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateSwivelCasterProps } from "./validate"

const shape = {
  wheelDiameter: positive.default(50),
  wheelWidth: positive.default(20),
  plateWidth: positive.default(50),
  plateLength: positive.default(50),
  plate4Hole: z.literal(true).default(true),
  holeGridX: positive.default(35),
  holeGridY: positive.default(35),
  holeDiameter: positive.default(6),
  swivelOffset: positive.default(20),
}

export const swivelCasterModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateSwivelCasterProps)

export const swivelCasterModelDefinitionSchema = z
  .object({ fn: z.literal("swivelcaster"), ...shape })
  .strict()
  .superRefine(validateSwivelCasterProps)

export type SwivelCasterModelPropsInput = z.input<
  typeof swivelCasterModelPropsSchema
>
export type SwivelCasterModelProps = z.output<
  typeof swivelCasterModelPropsSchema
>
export type SwivelCasterModelDefinition = z.output<
  typeof swivelCasterModelDefinitionSchema
>
