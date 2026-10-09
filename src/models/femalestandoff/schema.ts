import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

/** ISO metric coarse pitches; across-flats defaults are generic visual envelopes. */
export const femaleStandoffMetricDimensions = {
  M2: { diameter: 2, threadPitch: 0.4, acrossFlats: 4 },
  "M2.5": { diameter: 2.5, threadPitch: 0.45, acrossFlats: 5 },
  M3: { diameter: 3, threadPitch: 0.5, acrossFlats: 5.5 },
  M4: { diameter: 4, threadPitch: 0.7, acrossFlats: 7 },
  M5: { diameter: 5, threadPitch: 0.8, acrossFlats: 8 },
  M6: { diameter: 6, threadPitch: 1, acrossFlats: 10 },
  M8: { diameter: 8, threadPitch: 1.25, acrossFlats: 13 },
  M10: { diameter: 10, threadPitch: 1.5, acrossFlats: 17 },
  M12: { diameter: 12, threadPitch: 1.75, acrossFlats: 19 },
} as const

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
const shape = {
  metricSize: z
    .enum(["M2", "M2.5", "M3", "M4", "M5", "M6", "M8", "M10", "M12"])
    .default("M3"),
  acrossFlats: positiveLength.optional(),
  /** End-plane distance of the body; lower mounting face is Z=0. */
  length: positiveLength.default(10),
  threadPitch: positiveLength.optional(),
  hex: z.literal(true).default(true),
  threadedThrough: z.literal(true).default(true),
  leftHand: z.boolean().default(false),
  showThreads: z.boolean().default(true),
  /** Axial/radial 45-degree setback of the outer hex edges at both ends. */
  endChamfer: length.refine((value) => value >= 0).optional(),
}
type RawProps = z.output<z.ZodObject<typeof shape>>
function normalize<T extends RawProps>(props: T) {
  const defaults = femaleStandoffMetricDimensions[props.metricSize]
  const acrossFlats = props.acrossFlats ?? defaults.acrossFlats
  const threadPitch = props.threadPitch ?? defaults.threadPitch
  const endChamfer =
    props.endChamfer ??
    Math.min(
      0.2,
      props.length / 4,
      (acrossFlats - defaults.diameter * 1.08) / 8,
    )
  return { ...props, acrossFlats, threadPitch, endChamfer }
}
function validate(props: RawProps, context: z.RefinementCtx) {
  const resolved = normalize(props)
  const diameter = femaleStandoffMetricDimensions[props.metricSize].diameter
  const minor = diameter - ((5 * Math.sqrt(3)) / 8) * resolved.threadPitch
  const issue = (path: string, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })
  if (resolved.threadPitch > diameter / 3)
    issue(
      "threadPitch",
      "Thread pitch must not exceed one third of the major diameter",
    )
  if (resolved.acrossFlats - 2 * resolved.endChamfer <= diameter * 1.08)
    issue("acrossFlats", "The hex end face must surround the thread mouth")
  if (resolved.endChamfer < 0 || resolved.endChamfer >= props.length / 2)
    issue("endChamfer", "End chamfers must leave positive straight body length")
  if ((diameter * 1.08 - minor) / 2 >= props.length / 2)
    issue(
      "length",
      "Length must leave positive thread length between the bore chamfers",
    )
}
export const femaleStandoffModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(normalize)
export const femaleStandoffModelDefinitionSchema = z
  .object({ fn: z.literal("femalestandoff"), ...shape })
  .strict()
  .superRefine(validate)
  .transform(normalize)
export type FemaleStandoffModelPropsInput = z.input<
  typeof femaleStandoffModelPropsSchema
>
export type FemaleStandoffModelProps = z.output<
  typeof femaleStandoffModelPropsSchema
>
export type FemaleStandoffModelDefinition = z.output<
  typeof femaleStandoffModelDefinitionSchema
>

/** All dimensions are millimeters. The threaded bore passes through Z=0..length. */
export function getFemaleStandoffDimensions(
  input: FemaleStandoffModelPropsInput,
) {
  const props = femaleStandoffModelPropsSchema.parse(input)
  const diameter = femaleStandoffMetricDimensions[props.metricSize].diameter
  const boreMinorDiameter =
    diameter - ((5 * Math.sqrt(3)) / 8) * props.threadPitch
  const mouthDiameter = diameter * 1.08
  return {
    diameter,
    boreMinorDiameter,
    mouthDiameter,
    boreChamferDepth: (mouthDiameter - boreMinorDiameter) / 2,
    acrossFlats: props.acrossFlats,
    acrossCorners: (2 * props.acrossFlats) / Math.sqrt(3),
    endAcrossFlats: props.acrossFlats - 2 * props.endChamfer,
    endChamfer: props.endChamfer,
    length: props.length,
    threadPitch: props.threadPitch,
    threadDepth: props.length,
    bearingZ: 0,
    topZ: props.length,
  }
}
