import { z } from "zod"
import { positiveGearLengthSchema as positive } from "../../gear-parameter-schemas"
import { normalizeCamLatchProps } from "./normalize"
import { validateCamLatchProps } from "./validate"

const shape = {
  cutoutDiameter: positive.default(18),
  thread: z
    .string()
    .regex(/^m(?:\d+(?:\.\d+)?)$/i)
    .default("m18"),
  threadPitch: positive.default(1),
  barrelLength: positive.default(25),
  headOuterDiameter: positive.default(22),
  camLength: positive.default(30),
  camWidth: positive.default(10),
  camThickness: positive.default(3),
  slotDrive: z.literal(true).default(true),
  turnAngle: z.literal(90).default(90),
}

export const camLatchModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validateCamLatchProps)
  .transform(normalizeCamLatchProps)

export const camLatchModelDefinitionSchema = z
  .object({ fn: z.literal("camlatch"), ...shape })
  .strict()
  .superRefine(validateCamLatchProps)
  .transform(normalizeCamLatchProps)

export type CamLatchModelPropsInput = z.input<typeof camLatchModelPropsSchema>
export type CamLatchModelProps = z.output<typeof camLatchModelPropsSchema>
export type CamLatchModelDefinition = z.output<
  typeof camLatchModelDefinitionSchema
>
