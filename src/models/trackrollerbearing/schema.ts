import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { validateTrackRollerBearingProps } from "./validate"

const shape = {
  boreDiameter: positive.default(15),
  outerDiameter: positive.default(40),
  width: positive.default(18),
  rows: z.number().int().min(1).max(2).default(2),
  crownRadius: positive.default(500),
  closure: z.enum(["open", "shielded", "sealed"]).default("shielded"),
  boreMount: z.literal(true).default(true),
}

export const trackRollerBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateTrackRollerBearingProps)

export const trackRollerBearingModelDefinitionSchema = z
  .object({ fn: z.literal("trackrollerbearing"), ...shape })
  .strict()
  .superRefine(validateTrackRollerBearingProps)

export type TrackRollerBearingModelPropsInput = z.input<
  typeof trackRollerBearingModelPropsSchema
>
export type TrackRollerBearingModelProps = z.output<
  typeof trackRollerBearingModelPropsSchema
>
export type TrackRollerBearingModelDefinition = z.output<
  typeof trackRollerBearingModelDefinitionSchema
>
