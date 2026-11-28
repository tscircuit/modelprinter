import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateExternalGearPumpProps } from "./validate"

const shape = {
  portNominal: positive.default(6.35),
  width: positive.default(60),
  length: positive.default(80),
  height: positive.default(50),
  shaftOuterDiameter: positive.default(8),
  flangeWidth: positive.default(70),
  flangeThickness: positive.default(8),
  holePitch: positive.default(50),
  holeDiameter: positive.default(6),
  frontFlange: z.boolean().default(true),
}

export const externalGearPumpModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateExternalGearPumpProps)

export const externalGearPumpModelDefinitionSchema = z
  .object({ fn: z.literal("externalgearpump"), ...shape })
  .strict()
  .superRefine(validateExternalGearPumpProps)

export type ExternalGearPumpModelPropsInput = z.input<
  typeof externalGearPumpModelPropsSchema
>
export type ExternalGearPumpModelProps = z.output<
  typeof externalGearPumpModelPropsSchema
>
export type ExternalGearPumpModelDefinition = z.output<
  typeof externalGearPumpModelDefinitionSchema
>
