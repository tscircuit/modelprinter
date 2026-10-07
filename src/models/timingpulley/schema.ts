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

/** Nominal T5 clearance construction, not a count-specific DIN machining form. */
export const timingPulleyProfile = Object.freeze({
  pitch: 5,
  pitchLineOffset: 0.425,
  grooveOpening: 3.32,
  grooveDepth: 1.95,
  grooveAngle: 50,
  grooveRootRadius: 0.4,
  grooveEntryRadius: 0.6,
  matingBeltBackingThickness: 1,
})
const shape = {
  profile: z.literal("t5").default("t5"),
  toothCount: z.number().int().min(10).max(256).default(20),
  beltWidth: length.default(10),
  sideClearance: length.default(1),
  boreDiameter: length.default(5),
  flangeHeight: length.default(2),
  flangeThickness: length.default(1),
}
type Resolved = z.output<z.ZodObject<typeof shape>>
function dimensions(p: Resolved) {
  const pitchDiameter = (p.toothCount * timingPulleyProfile.pitch) / Math.PI
  const outsideDiameter =
    pitchDiameter - 2 * timingPulleyProfile.pitchLineOffset
  const faceWidth = p.beltWidth + 2 * p.sideClearance
  return {
    ...timingPulleyProfile,
    pitchDiameter,
    outsideDiameter,
    rootDiameter: outsideDiameter - 2 * timingPulleyProfile.grooveDepth,
    flangeDiameter: outsideDiameter + 2 * p.flangeHeight,
    faceWidth,
    totalWidth: faceWidth + 2 * p.flangeThickness,
    minZ: -p.flangeThickness,
    maxZ: faceWidth + p.flangeThickness,
    toothPitchAngle: (2 * Math.PI) / p.toothCount,
  }
}
function validate(p: Resolved, c: z.RefinementCtx) {
  const d = dimensions(p)
  if (Object.values(d).some((n) => !Number.isFinite(n)))
    c.addIssue({
      code: "custom",
      message: "Derived pulley dimensions must be finite",
    })
  if (p.boreDiameter >= d.rootDiameter)
    c.addIssue({
      code: "custom",
      path: ["boreDiameter"],
      message: "Bore must leave a positive wall below the groove roots",
    })
  if (p.flangeHeight <= d.matingBeltBackingThickness)
    c.addIssue({
      code: "custom",
      path: ["flangeHeight"],
      message: "Flanges must extend above the mating belt backing",
    })
}
export const timingPulleyModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const timingPulleyModelDefinitionSchema = z
  .object({ fn: z.literal("timingpulley"), ...shape })
  .strict()
  .superRefine(validate)
export type TimingPulleyModelPropsInput = z.input<
  typeof timingPulleyModelPropsSchema
>
export type TimingPulleyModelProps = z.output<
  typeof timingPulleyModelPropsSchema
>
export type TimingPulleyModelDefinition = z.output<
  typeof timingPulleyModelDefinitionSchema
>
export function getTimingPulleyDimensions(
  input: TimingPulleyModelPropsInput = {},
) {
  return dimensions(timingPulleyModelPropsSchema.parse(input))
}
