import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFilterRegulatorProps } from "./validate"

const shape = {
  portNominal: positive.default(6.35),
  width: positive.default(45),
  height: positive.default(160),
  depth: positive.default(40),
  knobOuterDiameter: positive.default(30),
  panelThreadDiameter: positive.default(30),
  panelThreadPitch: positive.default(1.5),
  bottomDrain: z.boolean().default(true),
  panelNut: z.boolean().default(true),
}

export const filterRegulatorModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFilterRegulatorProps)

export const filterRegulatorModelDefinitionSchema = z
  .object({ fn: z.literal("filterregulator"), ...shape })
  .strict()
  .superRefine(validateFilterRegulatorProps)

export type FilterRegulatorModelPropsInput = z.input<
  typeof filterRegulatorModelPropsSchema
>
export type FilterRegulatorModelProps = z.output<
  typeof filterRegulatorModelPropsSchema
>
export type FilterRegulatorModelDefinition = z.output<
  typeof filterRegulatorModelDefinitionSchema
>
