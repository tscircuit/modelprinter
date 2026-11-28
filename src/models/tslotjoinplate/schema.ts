import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTSlotJoinPlateProps } from "./validate"

const shape = {
  length: positive.default(80),
  width: positive.default(20),
  thickness: positive.default(4),
  slotCount: z.number().int().min(2).max(64).default(4),
  /** Capsule width and overall longitudinal length, including both semicircular ends. */
  slot: z.tuple([positive, positive]).default([5, 10]),
  /** Center-to-center longitudinal spacing between adjacent collinear slots. */
  pitch: positive.default(20),
}

/** Flat straight rectangular T-slot splice plate centered on XY (X spans ±length/2,
 * Y spans ±width/2), mounting face at Z=0, material extending to +thickness,
 * with collinear longitudinal capsule through-slots centered along Y=0.
 */
export const tSlotJoinPlateModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTSlotJoinPlateProps)

export const tSlotJoinPlateModelDefinitionSchema = z
  .object({ fn: z.literal("tslotjoinplate"), ...shape })
  .strict()
  .superRefine(validateTSlotJoinPlateProps)

export type TSlotJoinPlateModelPropsInput = z.input<
  typeof tSlotJoinPlateModelPropsSchema
>
export type TSlotJoinPlateModelProps = z.output<
  typeof tSlotJoinPlateModelPropsSchema
>
export type TSlotJoinPlateModelDefinition = z.output<
  typeof tSlotJoinPlateModelDefinitionSchema
>
