import { z } from "zod"
import { positiveModelLengthSchema } from "../../model-length-schema"
const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(
        /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i,
        "Expected a complete numeric length with an optional unit",
      ),
  ])
  .pipe(positiveModelLengthSchema)

/** Basic, sharp-cornered T5 trapezoid; lengths are millimeters, angle is degrees. */
export const timingBeltProfile = Object.freeze({
  pitch: 5,
  toothHeight: 1.2,
  backingThickness: 1,
  toothBaseWidth: 2.65,
  toothAngle: 40,
  pitchLineOffset: 0.425,
})
const shape = {
  profile: z.literal("t5").default("t5"),
  shape: z.literal("openstraight").default("openstraight"),
  toothCount: z.number().int().min(1).max(1024).default(20),
  width: length.default(10),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function dimensions(p: Resolved) {
  const d = timingBeltProfile
  return {
    ...d,
    length: p.toothCount * d.pitch,
    toothTipWidth:
      d.toothBaseWidth -
      2 * d.toothHeight * Math.tan((d.toothAngle * Math.PI) / 360),
    totalThickness: d.backingThickness + d.toothHeight,
    toothRootZ: -d.pitchLineOffset,
    toothTipZ: -d.pitchLineOffset - d.toothHeight,
    backZ: d.backingThickness - d.pitchLineOffset,
    firstToothCenterX: d.pitch / 2,
    lastToothCenterX: (p.toothCount - 0.5) * d.pitch,
    endMargin: (d.pitch - d.toothBaseWidth) / 2,
  }
}
export const timingBeltModelPropsSchema = z.object(shape).strict()
export const timingBeltModelDefinitionSchema = z
  .object({ fn: z.literal("timingbelt"), ...shape })
  .strict()
export type TimingBeltModelPropsInput = z.input<
  typeof timingBeltModelPropsSchema
>
export type TimingBeltModelProps = z.output<typeof timingBeltModelPropsSchema>
export type TimingBeltModelDefinition = z.output<
  typeof timingBeltModelDefinitionSchema
>
export function getTimingBeltDimensions(input: TimingBeltModelPropsInput = {}) {
  return dimensions(timingBeltModelPropsSchema.parse(input))
}
