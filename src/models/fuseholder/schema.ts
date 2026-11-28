import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeFuseHolderProps } from "./normalize"
import { validateFuseHolderProps } from "./validate"

const shape = {
  fuseDiameter: positive.default(5),
  fuseLength: positive.default(20),
  panelHoleDiameter: positive.default(12),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m12"),
  threadPitch: positive.default(1),
  bodyLength: positive.default(35),
  capOuterDiameter: positive.default(16),
  panelBayonet: z.literal(true).default(true),
}

export const fuseHolderModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateFuseHolderProps)
  .transform(normalizeFuseHolderProps)

export const fuseHolderModelDefinitionSchema = z
  .object({ fn: z.literal("fuseholder"), ...shape })
  .strict()
  .superRefine(validateFuseHolderProps)
  .transform(normalizeFuseHolderProps)

export type FuseHolderModelPropsInput = z.input<
  typeof fuseHolderModelPropsSchema
>
export type FuseHolderModelProps = z.output<typeof fuseHolderModelPropsSchema>
export type FuseHolderModelDefinition = z.output<
  typeof fuseHolderModelDefinitionSchema
>
