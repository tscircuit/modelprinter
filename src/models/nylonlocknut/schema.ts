import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

/** ISO 7040:2012, Table 1: P, s max, h max, m min, da max.
 * https://cdn.standards.iteh.ai/samples/61363/a60b58fa5c3b449e81910d0a4b47c7e4/ISO-7040-2012.pdf
 * The locking feature is a documented nominal visualization, not a tolerance model.
 */
export const nylonLockNutDimensions = {
  M5: {
    diameter: 5,
    threadPitch: 0.8,
    acrossFlats: 8,
    height: 6.8,
    bodyHeight: 4.4,
    mouthDiameter: 5.75,
  },
  M6: {
    diameter: 6,
    threadPitch: 1,
    acrossFlats: 10,
    height: 8,
    bodyHeight: 4.9,
    mouthDiameter: 6.75,
  },
  M8: {
    diameter: 8,
    threadPitch: 1.25,
    acrossFlats: 13,
    height: 9.5,
    bodyHeight: 6.44,
    mouthDiameter: 8.75,
  },
  M10: {
    diameter: 10,
    threadPitch: 1.5,
    acrossFlats: 16,
    height: 11.9,
    bodyHeight: 8.04,
    mouthDiameter: 10.8,
  },
  M12: {
    diameter: 12,
    threadPitch: 1.75,
    acrossFlats: 18,
    height: 14.9,
    bodyHeight: 10.37,
    mouthDiameter: 13,
  },
} as const
export const nylonLockNutMetricSizeSchema = z.enum([
  "M5",
  "M6",
  "M8",
  "M10",
  "M12",
])
const length = z
  .union([
    z.number().finite(),
    z
      .string()
      .regex(/^[+]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
  .refine(
    (value) => Number.isFinite(value) && value > 0,
    "Length must be finite and positive",
  )
const shape = {
  standard: z.enum(["iso7040", "iso7040:2012"]).default("iso7040:2012"),
  metricSize: nylonLockNutMetricSizeSchema,
  threadPitch: length.optional(),
  rightHanded: z.literal(true).default(true),
  threadClass: z.literal("6H").default("6H"),
  showThreads: z.boolean().default(true),
}
type RawProps = z.output<z.ZodObject<typeof shape>>
function validate(props: RawProps, context: z.RefinementCtx) {
  const expected = nylonLockNutDimensions[props.metricSize].threadPitch
  if (
    props.threadPitch !== undefined &&
    Math.abs(props.threadPitch - expected) > 1e-9
  )
    context.addIssue({
      code: "custom",
      path: ["threadPitch"],
      message: "ISO 7040 nuts require the selected coarse pitch",
    })
}
function normalize<T extends RawProps>(props: T) {
  return {
    ...props,
    standard: "iso7040:2012" as const,
    threadPitch: nylonLockNutDimensions[props.metricSize].threadPitch,
  }
}
export const nylonLockNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(normalize)
export const nylonLockNutModelDefinitionSchema = z
  .object({ fn: z.literal("nylonlocknut"), ...shape })
  .strict()
  .superRefine(validate)
  .transform(normalize)
export type NylonLockNutModelPropsInput = z.input<
  typeof nylonLockNutModelPropsSchema
>
export type NylonLockNutModelProps = z.output<
  typeof nylonLockNutModelPropsSchema
>
export type NylonLockNutModelDefinition = z.output<
  typeof nylonLockNutModelDefinitionSchema
>

/** Resolved dimensions and datums in mm. No manufacturing tolerances or torque prediction. */
export function getNylonLockNutDimensions(input: NylonLockNutModelPropsInput) {
  const props = nylonLockNutModelPropsSchema.parse(input)
  const d = nylonLockNutDimensions[props.metricSize]
  const acrossCorners = (2 * d.acrossFlats) / Math.sqrt(3)
  const boreMinorDiameter = d.diameter - (5 * Math.sqrt(3) * d.threadPitch) / 8
  return {
    ...d,
    acrossCorners,
    boreMinorDiameter,
    faceDiameter: d.acrossFlats,
    outerChamferAngle: 30,
    outerChamferDepth: (acrossCorners - d.acrossFlats) / (2 * Math.sqrt(3)),
    boreChamferAngle: 90,
    boreChamferDepth: (d.mouthDiameter - boreMinorDiameter) / 2,
    threadExitDiameter: d.diameter,
    threadExitChamferDepth: (d.diameter - boreMinorDiameter) / 2,
    collarDiameter: d.acrossFlats,
    collarTopChamfer: d.threadPitch / 4,
    pocketDiameter: d.acrossFlats - 2 * d.threadPitch,
    insertBoreDiameter: d.diameter - d.threadPitch / 4,
    insertBoreChamfer: d.threadPitch / 8,
    insertBottomZ: d.bodyHeight,
    insertTopZ: d.height - d.threadPitch / 4,
    bearingZ: 0,
    topZ: d.height,
    threadDepth: d.bodyHeight,
  }
}
