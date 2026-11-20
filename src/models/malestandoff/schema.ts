import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const length = z
  .union([
    z.number(),
    z
      .string()
      .regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
const positiveLength = length.refine(
  (value) => value > 0,
  "Length must be positive",
)
const nonnegativeLength = length.refine(
  (value) => value >= 0,
  "Length cannot be negative",
)

/** Selected ISO metric coarse pitches in mm, without fit/tolerance claims. */
export const maleStandoffCoarsePitches = {
  M2: 0.4,
  "M2.5": 0.45,
  M3: 0.5,
  M4: 0.7,
  M5: 0.8,
  M6: 1,
  M8: 1.25,
  M10: 1.5,
  M12: 1.75,
} as const
export const maleStandoffMetricSizeSchema = z.enum([
  "M2",
  "M2.5",
  "M3",
  "M4",
  "M5",
  "M6",
  "M8",
  "M10",
  "M12",
])
const shape = {
  metricSize: maleStandoffMetricSizeSchema,
  acrossFlats: positiveLength,
  /** Hexagonal body height between lower bearing plane Z=0 and upper bearing plane Z=length, excluding both studs. */
  length: positiveLength,
  /** Equal external threaded stud projection at both Z=-studLength..0 and Z=length..length+studLength. */
  studLength: positiveLength,
  hex: z.literal(true).default(true),
  equalEnds: z.literal(true).default(true),
  threadPitch: positiveLength.optional(),
  leftHand: z.boolean().default(false),
  showThreads: z.boolean().default(true),
  bodyChamfer: nonnegativeLength.optional(),
  studChamfer: nonnegativeLength.optional(),
}
type RawProps = z.output<z.ZodObject<typeof shape>>
function resolve<T extends RawProps>(props: T) {
  const diameter = Number(props.metricSize.slice(1))
  const threadPitch =
    props.threadPitch ?? maleStandoffCoarsePitches[props.metricSize]
  const chamfer = Math.min(
    threadPitch / 4,
    (props.acrossFlats - diameter) / 8,
    props.length / 8,
    props.studLength / 8,
  )
  return {
    ...props,
    threadPitch,
    bodyChamfer: props.bodyChamfer ?? chamfer,
    studChamfer: props.studChamfer ?? chamfer,
  }
}
function validate(props: RawProps, context: z.RefinementCtx) {
  const p = resolve(props)
  const diameter = Number(p.metricSize.slice(1))
  const issue = (path: string, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })
  const largestDimension = Math.max(
    diameter,
    p.acrossFlats,
    p.length,
    p.studLength,
    p.threadPitch,
  )
  if (!Number.isFinite((4 * largestDimension) ** 3)) {
    issue(
      "length",
      "Dimensions must permit finite derived coordinates and volume",
    )
    return
  }
  const externalMinorDiameter =
    diameter - ((17 * Math.sqrt(3)) / 24) * p.threadPitch
  if (externalMinorDiameter <= 0)
    issue("threadPitch", "Pitch must leave a positive thread root diameter")
  if (p.bodyChamfer < 0 || p.bodyChamfer >= p.length / 2)
    issue("bodyChamfer", "Body chamfers must be nonnegative and separate")
  if (
    p.studChamfer < 0 ||
    p.studChamfer >= Math.min(externalMinorDiameter / 2, p.studLength / 2)
  )
    issue(
      "studChamfer",
      "Stud chamfer must leave a flat tip and a threaded stud",
    )
  if ((diameter - externalMinorDiameter) / 2 + p.studChamfer >= p.studLength)
    issue("studLength", "Each stud must extend beyond its conical tip")
  if (diameter >= p.acrossFlats - 2 * p.bodyChamfer)
    issue(
      "acrossFlats",
      "Hex body and chamfers must leave flat bearing shoulders around both studs",
    )
}
export const maleStandoffModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(resolve)
export const maleStandoffModelDefinitionSchema = z
  .object({ fn: z.literal("malestandoff"), ...shape })
  .strict()
  .superRefine(validate)
  .transform(resolve)
export type MaleStandoffModelPropsInput = z.input<
  typeof maleStandoffModelPropsSchema
>
export type MaleStandoffModelProps = z.output<
  typeof maleStandoffModelPropsSchema
>
export type MaleStandoffModelDefinition = z.output<
  typeof maleStandoffModelDefinitionSchema
>

/** Generic visual dimensions in mm; lower body shoulder is Z=0, upper body shoulder is Z=length. */
export function getMaleStandoffDimensions(input: MaleStandoffModelPropsInput) {
  const props = maleStandoffModelPropsSchema.parse(input)
  const diameter = Number(props.metricSize.slice(1))
  const externalMinorDiameter =
    diameter - ((17 * Math.sqrt(3)) / 24) * props.threadPitch
  return {
    ...props,
    diameter,
    acrossCorners: (2 * props.acrossFlats) / Math.sqrt(3),
    endAcrossFlats: props.acrossFlats - 2 * props.bodyChamfer,
    externalMinorDiameter,
    studTipDiameter: externalMinorDiameter - 2 * props.studChamfer,
    studChamferDepth:
      (diameter - externalMinorDiameter) / 2 + props.studChamfer,
    bearingZ: 0,
    topZ: props.length,
    bottomStudTipZ: -props.studLength,
    topStudTipZ: props.length + props.studLength,
    totalLength: props.length + 2 * props.studLength,
  }
}
