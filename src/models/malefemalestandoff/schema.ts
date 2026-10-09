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
export const maleFemaleStandoffCoarsePitches = {
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
export const maleFemaleStandoffMetricSizeSchema = z.enum([
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
  metricSize: maleFemaleStandoffMetricSizeSchema,
  acrossFlats: positiveLength,
  /** Body height above its lower mounting plane Z=0, excluding the stud. */
  length: positiveLength,
  studLength: positiveLength,
  /** Blind female socket depth measured down from the upper mounting plane. */
  femaleDepth: positiveLength,
  hex: z.literal(true).default(true),
  threadPitch: positiveLength.optional(),
  leftHand: z.boolean().default(false),
  showThreads: z.boolean().default(true),
  bodyChamfer: nonnegativeLength.optional(),
  studChamfer: nonnegativeLength.optional(),
  mouthChamfer: nonnegativeLength.optional(),
}
type RawProps = z.output<z.ZodObject<typeof shape>>
function resolve<T extends RawProps>(props: T) {
  const diameter = Number(props.metricSize.slice(1))
  const threadPitch =
    props.threadPitch ?? maleFemaleStandoffCoarsePitches[props.metricSize]
  const chamfer = Math.min(
    threadPitch / 4,
    (props.acrossFlats - diameter) / 8,
    props.length / 8,
    props.studLength / 8,
    props.femaleDepth / 8,
  )
  return {
    ...props,
    threadPitch,
    bodyChamfer: props.bodyChamfer ?? chamfer,
    studChamfer: props.studChamfer ?? chamfer,
    mouthChamfer: props.mouthChamfer ?? chamfer,
  }
}
function validate(props: RawProps, context: z.RefinementCtx) {
  const p = resolve(props)
  const diameter = Number(p.metricSize.slice(1))
  const externalMinorDiameter =
    diameter - ((17 * Math.sqrt(3)) / 24) * p.threadPitch
  const boreMinorDiameter = diameter - ((5 * Math.sqrt(3)) / 8) * p.threadPitch
  const issue = (path: string, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })
  if (Math.min(externalMinorDiameter, boreMinorDiameter) <= 0)
    issue("threadPitch", "Pitch must leave positive thread root diameters")
  if (p.femaleDepth >= p.length)
    issue("femaleDepth", "The blind socket must leave a solid floor above Z=0")
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
    issue("studLength", "The stud must extend beyond its conical tip")
  if (
    p.mouthChamfer < 0 ||
    (diameter - boreMinorDiameter) / 2 + p.mouthChamfer >= p.femaleDepth
  )
    issue(
      "mouthChamfer",
      "Socket mouth chamfer must leave a straight blind bore",
    )
  if (diameter + 2 * p.mouthChamfer >= p.acrossFlats - 2 * p.bodyChamfer)
    issue(
      "acrossFlats",
      "Hex body and chamfers must leave material around the socket and stud",
    )
}
export const maleFemaleStandoffModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(resolve)
export const maleFemaleStandoffModelDefinitionSchema = z
  .object({ fn: z.literal("malefemalestandoff"), ...shape })
  .strict()
  .superRefine(validate)
  .transform(resolve)
export type MaleFemaleStandoffModelPropsInput = z.input<
  typeof maleFemaleStandoffModelPropsSchema
>
export type MaleFemaleStandoffModelProps = z.output<
  typeof maleFemaleStandoffModelPropsSchema
>
export type MaleFemaleStandoffModelDefinition = z.output<
  typeof maleFemaleStandoffModelDefinitionSchema
>

/** Generic visual dimensions in mm; the blind bore has a flat floor. */
export function getMaleFemaleStandoffDimensions(
  input: MaleFemaleStandoffModelPropsInput,
) {
  const props = maleFemaleStandoffModelPropsSchema.parse(input)
  const diameter = Number(props.metricSize.slice(1))
  const externalMinorDiameter =
    diameter - ((17 * Math.sqrt(3)) / 24) * props.threadPitch
  const boreMinorDiameter =
    diameter - ((5 * Math.sqrt(3)) / 8) * props.threadPitch
  return {
    ...props,
    diameter,
    acrossCorners: (2 * props.acrossFlats) / Math.sqrt(3),
    externalMinorDiameter,
    boreMinorDiameter,
    mouthDiameter: diameter + 2 * props.mouthChamfer,
    boreChamferDepth: (diameter - boreMinorDiameter) / 2 + props.mouthChamfer,
    studTipDiameter: externalMinorDiameter - 2 * props.studChamfer,
    studChamferDepth:
      (diameter - externalMinorDiameter) / 2 + props.studChamfer,
    bearingZ: 0,
    topZ: props.length,
    studTipZ: -props.studLength,
    boreFloorZ: props.length - props.femaleDepth,
    totalLength: props.length + props.studLength,
  }
}
