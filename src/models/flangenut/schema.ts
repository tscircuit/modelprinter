import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

/** ISO 4161:2012 Table 1: maximum s, m, dc, da; minimum c, dw and mw.
 * Untoleranced visual envelopes, not manufacturing certification.
 * https://cdn.standards.iteh.ai/samples/61523/6933d05d5928493fa0aaa091527bed78/ISO-4161-2012.pdf
 */
export const flangeNutDimensions = {
  M5: {
    diameter: 5,
    threadPitch: 0.8,
    acrossFlats: 8,
    height: 5,
    flangeDiameter: 11.8,
    mouthDiameter: 5.75,
    minimumFlangeThickness: 1,
    minimumBearingDiameter: 9.8,
    minimumWrenchingHeight: 2.5,
  },
  M6: {
    diameter: 6,
    threadPitch: 1,
    acrossFlats: 10,
    height: 6,
    flangeDiameter: 14.2,
    mouthDiameter: 6.75,
    minimumFlangeThickness: 1.1,
    minimumBearingDiameter: 12.2,
    minimumWrenchingHeight: 3.1,
  },
  M8: {
    diameter: 8,
    threadPitch: 1.25,
    acrossFlats: 13,
    height: 8,
    flangeDiameter: 17.9,
    mouthDiameter: 8.75,
    minimumFlangeThickness: 1.2,
    minimumBearingDiameter: 15.8,
    minimumWrenchingHeight: 4.6,
  },
  M10: {
    diameter: 10,
    threadPitch: 1.5,
    acrossFlats: 15,
    height: 10,
    flangeDiameter: 21.8,
    mouthDiameter: 10.8,
    minimumFlangeThickness: 1.5,
    minimumBearingDiameter: 19.6,
    minimumWrenchingHeight: 5.6,
  },
  M12: {
    diameter: 12,
    threadPitch: 1.75,
    acrossFlats: 18,
    height: 12,
    flangeDiameter: 26,
    mouthDiameter: 13,
    minimumFlangeThickness: 1.8,
    minimumBearingDiameter: 23.8,
    minimumWrenchingHeight: 6.8,
  },
  M14: {
    diameter: 14,
    threadPitch: 2,
    acrossFlats: 21,
    height: 14,
    flangeDiameter: 29.9,
    mouthDiameter: 15.1,
    minimumFlangeThickness: 2.1,
    minimumBearingDiameter: 27.6,
    minimumWrenchingHeight: 7.7,
  },
  M16: {
    diameter: 16,
    threadPitch: 2,
    acrossFlats: 24,
    height: 16,
    flangeDiameter: 34.5,
    mouthDiameter: 17.3,
    minimumFlangeThickness: 2.4,
    minimumBearingDiameter: 31.9,
    minimumWrenchingHeight: 8.9,
  },
  M20: {
    diameter: 20,
    threadPitch: 2.5,
    acrossFlats: 30,
    height: 20,
    flangeDiameter: 42.8,
    mouthDiameter: 21.6,
    minimumFlangeThickness: 3,
    minimumBearingDiameter: 39.9,
    minimumWrenchingHeight: 10.7,
  },
} as const

export const flangeNutMetricSizeSchema = z.enum([
  "M5",
  "M6",
  "M8",
  "M10",
  "M12",
  "M14",
  "M16",
  "M20",
])
const positiveLength = z
  .union([
    z.number().finite(),
    z
      .string()
      .regex(/^[+]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
  .refine((value) => value > 0, "Length must be positive")
const shape = {
  standard: z.enum(["iso4161", "iso4161:2012"]).default("iso4161:2012"),
  metricSize: flangeNutMetricSizeSchema,
  plainFace: z.literal(true).default(true),
  threadPitch: positiveLength.optional(),
  rightHanded: z.literal(true).default(true),
  threadClass: z.literal("6H").default("6H"),
  showThreads: z.boolean().default(true),
}
type RawProps = z.output<z.ZodObject<typeof shape>>
function validate(props: RawProps, context: z.RefinementCtx) {
  if (
    props.threadPitch !== undefined &&
    Math.abs(
      props.threadPitch - flangeNutDimensions[props.metricSize].threadPitch,
    ) > 1e-9
  )
    context.addIssue({
      code: "custom",
      path: ["threadPitch"],
      message: "ISO 4161 flange nuts require the tabulated coarse pitch",
    })
}
function normalize<T extends RawProps>(props: T) {
  return {
    ...props,
    standard: "iso4161:2012" as const,
    threadPitch: flangeNutDimensions[props.metricSize].threadPitch,
  }
}
export const flangeNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(normalize)
export const flangeNutModelDefinitionSchema = z
  .object({ fn: z.literal("flangenut"), ...shape })
  .strict()
  .superRefine(validate)
  .transform(normalize)
export type FlangeNutModelPropsInput = z.input<typeof flangeNutModelPropsSchema>
export type FlangeNutModelProps = z.output<typeof flangeNutModelPropsSchema>
export type FlangeNutModelDefinition = z.output<
  typeof flangeNutModelDefinitionSchema
>

/** Dimensions in mm. Flat plain bearing face Z=0; top Z=height; axis +Z.
 * Fixed visual choices: 20° flange taper, 30° top chamfer from horizontal,
 * 90° included bore mouths, sharp flange/hex intersection. See docs/flange-nut.md.
 */
export function getFlangeNutDimensions(input: FlangeNutModelPropsInput) {
  const props = flangeNutModelPropsSchema.parse(input)
  const d = flangeNutDimensions[props.metricSize]
  const acrossCorners = (2 * d.acrossFlats) / Math.sqrt(3)
  const boreMinorDiameter =
    d.diameter - ((5 * Math.sqrt(3)) / 8) * d.threadPitch
  return {
    ...d,
    acrossCorners,
    boreMinorDiameter,
    bearingDiameter: d.flangeDiameter,
    flangeRimHeight: d.minimumFlangeThickness,
    flangeTaperAngle: 20,
    flangeTopAtFlatZ:
      d.minimumFlangeThickness +
      ((d.flangeDiameter - d.acrossFlats) / 2) * Math.tan(Math.PI / 9),
    faceDiameter: d.acrossFlats,
    topChamferAngle: 30,
    topChamferDepth: (acrossCorners - d.acrossFlats) / 2 / Math.sqrt(3),
    transitionRadius: 0,
    boreChamferAngle: 90,
    boreChamferDepth: (d.mouthDiameter - boreMinorDiameter) / 2,
    bearingZ: 0,
    topZ: d.height,
    threadDepth: d.height,
  }
}
