import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

/** ISO 7380-1:2022 Table 1, nominal/max envelopes and minimum socket depth.
 * https://cdn.standards.iteh.ai/samples/78699/a175805085534f98983d6c8aa583a5b0/ISO-7380-1-2022.pdf
 * Reference thread lengths b: Fuller Fasteners ISO 7380-1 table, accessed 2026-10-05.
 * https://fullerfasteners.com/tech/iso-7380-1-specifications-hex-socket-button-head-screws/
 * See docs/button-screw.md for the fixed contour and visualization simplifications.
 */
export const buttonScrewDimensions = {
  M3: {
    diameter: 3,
    threadPitch: 0.5,
    headDiameter: 5.7,
    headHeight: 1.65,
    crownFlatDiameter: 2.6,
    crownRadius: 3.5,
    socketWidth: 2,
    socketDepth: 1.04,
    underHeadRadius: 0.3,
    referenceThreadLength: 18,
  },
  M4: {
    diameter: 4,
    threadPitch: 0.7,
    headDiameter: 7.6,
    headHeight: 2.2,
    crownFlatDiameter: 3.8,
    crownRadius: 4.4,
    socketWidth: 2.5,
    socketDepth: 1.3,
    underHeadRadius: 0.4,
    referenceThreadLength: 20,
  },
  M5: {
    diameter: 5,
    threadPitch: 0.8,
    headDiameter: 9.5,
    headHeight: 2.75,
    crownFlatDiameter: 5,
    crownRadius: 5.5,
    socketWidth: 3,
    socketDepth: 1.56,
    underHeadRadius: 0.45,
    referenceThreadLength: 22,
  },
  M6: {
    diameter: 6,
    threadPitch: 1,
    headDiameter: 10.5,
    headHeight: 3.3,
    crownFlatDiameter: 6,
    crownRadius: 5.9,
    socketWidth: 4,
    socketDepth: 2.08,
    underHeadRadius: 0.5,
    referenceThreadLength: 24,
  },
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
  .refine((value) => value > 0, "Length must be positive")
export const buttonScrewMetricSizeSchema = z.enum(["M3", "M4", "M5", "M6"])
const shape = {
  standard: z
    .enum(["iso7380-1", "iso7380-1:2022"])
    .default("iso7380-1")
    .transform(() => "iso7380-1:2022" as const),
  metricSize: buttonScrewMetricSizeSchema,
  /** Under-head length; this family supports short fully threaded screws only. */
  length,
  drive: z.literal("hexsocket").default("hexsocket"),
  thread: z.literal("full").default("full"),
  threadPitch: length.optional(),
  threadHand: z.literal("right").default("right"),
  threadClass: z.literal("6g").default("6g"),
  showThreads: z.boolean().default(true),
}
function validate(
  props: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  const dimensions = buttonScrewDimensions[props.metricSize]
  if (
    props.threadPitch !== undefined &&
    Math.abs(props.threadPitch - dimensions.threadPitch) > 1e-9
  )
    context.addIssue({
      code: "custom",
      path: ["threadPitch"],
      message: "ISO 7380-1 requires the tabulated coarse pitch",
    })
  if (props.length > dimensions.referenceThreadLength)
    context.addIssue({
      code: "custom",
      path: ["length"],
      message:
        "This family supports only lengths at or below the reference full-thread length",
    })
  if (props.length < 2 * dimensions.threadPitch)
    context.addIssue({
      code: "custom",
      path: ["length"],
      message: "Length must allow the fixed thread runout and tip chamfer",
    })
}
function normalize<T extends z.output<z.ZodObject<typeof shape>>>(props: T) {
  return {
    ...props,
    threadPitch: buttonScrewDimensions[props.metricSize].threadPitch,
  }
}
export const buttonScrewModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(normalize)
export const buttonScrewModelDefinitionSchema = z
  .object({ fn: z.literal("buttonscrew"), ...shape })
  .strict()
  .superRefine(validate)
  .transform(normalize)
export type ButtonScrewModelPropsInput = z.input<
  typeof buttonScrewModelPropsSchema
>
export type ButtonScrewModelProps = z.output<typeof buttonScrewModelPropsSchema>
export type ButtonScrewModelDefinition = z.output<
  typeof buttonScrewModelDefinitionSchema
>

/** Resolved lengths in mm; the head bearing plane is z=0 and tip is z=-length. */
export function getButtonScrewDimensions(input: ButtonScrewModelPropsInput) {
  const props = buttonScrewModelPropsSchema.parse(input)
  const dims = buttonScrewDimensions[props.metricSize]
  // Select the circle through the lower rim and upper flat with its center below/inside the rim.
  const dr = dims.crownFlatDiameter / 2 - dims.headDiameter / 2
  const dz = dims.headHeight
  const chord = Math.hypot(dr, dz)
  const offset = Math.sqrt(dims.crownRadius ** 2 - chord ** 2 / 4)
  return {
    ...dims,
    length: props.length,
    overallLength: props.length + dims.headHeight,
    crownArcCenterR:
      (dims.headDiameter + dims.crownFlatDiameter) / 4 - (offset * dz) / chord,
    crownArcCenterZ: dz / 2 + (offset * dr) / chord,
    threadMinorDiameter:
      dims.diameter - ((5 * Math.sqrt(3)) / 8) * dims.threadPitch,
    threadPitchDiameter:
      dims.diameter - ((3 * Math.sqrt(3)) / 8) * dims.threadPitch,
    threadRunoutLength: dims.threadPitch,
    tipChamfer: dims.threadPitch / 2,
    bearingZ: 0,
    tipZ: -props.length,
    topZ: dims.headHeight,
  }
}
