import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateCartridgeFuseProps } from "./validate"

const shape = {
  cartridge5x20: z.literal(true).default(true),
  outerDiameter: positive.default(5),
  length: positive.default(20),
  capLength: positive.default(5),
  ceramicCylinder: z.literal(true).default(true),
}

export const cartridgeFuseModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCartridgeFuseProps)

export const cartridgeFuseModelDefinitionSchema = z
  .object({ fn: z.literal("cartridgefuse"), ...shape })
  .strict()
  .superRefine(validateCartridgeFuseProps)

export type CartridgeFuseModelPropsInput = z.input<
  typeof cartridgeFuseModelPropsSchema
>
export type CartridgeFuseModelProps = z.output<
  typeof cartridgeFuseModelPropsSchema
>
export type CartridgeFuseModelDefinition = z.output<
  typeof cartridgeFuseModelDefinitionSchema
>
