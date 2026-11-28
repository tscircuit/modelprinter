import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateFrlAssemblyProps } from "./validate"

const shape = {
  portNominal: positive.default(6.35),
  width: positive.default(140),
  height: positive.default(160),
  depth: positive.default(40),
  bowlOuterDiameter: positive.default(35),
  holes: z.number().int().min(2).max(6).default(2),
  holePitch: positive.default(100),
  holeDiameter: positive.default(5),
  backRail: z.boolean().default(true),
}

export const frlAssemblyModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFrlAssemblyProps)

export const frlAssemblyModelDefinitionSchema = z
  .object({ fn: z.literal("frlassembly"), ...shape })
  .strict()
  .superRefine(validateFrlAssemblyProps)

export type FrlAssemblyModelPropsInput = z.input<
  typeof frlAssemblyModelPropsSchema
>
export type FrlAssemblyModelProps = z.output<typeof frlAssemblyModelPropsSchema>
export type FrlAssemblyModelDefinition = z.output<
  typeof frlAssemblyModelDefinitionSchema
>
