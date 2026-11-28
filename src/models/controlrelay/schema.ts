import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateControlRelayProps } from "./validate"

const shape = {
  width: positive.default(22),
  depth: positive.default(28),
  height: positive.default(35),
  pins: z.union([z.literal(8), z.literal(11)]).default(8),
  pinDiameter: positive.default(1),
  pinCircleDiameter: positive.default(11),
  centerKey: z.literal(true).default(true),
  rectangularCase: z.literal(true).default(true),
}

export const controlRelayModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateControlRelayProps)

export const controlRelayModelDefinitionSchema = z
  .object({ fn: z.literal("controlrelay"), ...shape })
  .strict()
  .superRefine(validateControlRelayProps)

export type ControlRelayModelPropsInput = z.input<
  typeof controlRelayModelPropsSchema
>
export type ControlRelayModelProps = z.output<
  typeof controlRelayModelPropsSchema
>
export type ControlRelayModelDefinition = z.output<
  typeof controlRelayModelDefinitionSchema
>
