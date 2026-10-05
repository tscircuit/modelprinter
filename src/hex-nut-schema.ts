import { z } from "zod"
import { modelLengthSchema } from "./model-length-schema"

/** Pinned ISO 4032:2023 Table 1 (grade A, no washer-face): nominal/max s,m
 * and maximum bore-mouth diameter da. This is an untoleranced visual contract.
 * https://cdn.standards.iteh.ai/samples/75016/5b1f83bd2dc44fc199973e9957a75086/ISO-4032-2023.pdf
 * Fixed chamfers and datums are documented in docs/hex-nut.md.
 */
export const hexNutDimensions = {
  M5: {
    diameter: 5,
    threadPitch: 0.8,
    acrossFlats: 8,
    height: 4.7,
    mouthDiameter: 5.75,
  },
  M6: {
    diameter: 6,
    threadPitch: 1,
    acrossFlats: 10,
    height: 5.2,
    mouthDiameter: 6.75,
  },
  M8: {
    diameter: 8,
    threadPitch: 1.25,
    acrossFlats: 13,
    height: 6.8,
    mouthDiameter: 8.75,
  },
  M10: {
    diameter: 10,
    threadPitch: 1.5,
    acrossFlats: 16,
    height: 8.4,
    mouthDiameter: 10.8,
  },
  M12: {
    diameter: 12,
    threadPitch: 1.75,
    acrossFlats: 18,
    height: 10.8,
    mouthDiameter: 12.96,
  },
} as const
export const hexNutMetricSizeSchema = z.enum(["M5", "M6", "M8", "M10", "M12"])
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
const shape = {
  standard: z
    .enum(["iso4032", "iso4032:2023"])
    .default("iso4032")
    .transform(() => "iso4032:2023" as const),
  metricSize: hexNutMetricSizeSchema,
  threadPitch: length.optional(),
  threadHand: z.literal("right").default("right"),
  threadClass: z.literal("6H").default("6H"),
  showThreads: z.boolean().default(true),
}
function validate(
  props: z.output<z.ZodObject<typeof shape>>,
  context: z.RefinementCtx,
) {
  if (
    props.threadPitch !== undefined &&
    Math.abs(
      props.threadPitch - hexNutDimensions[props.metricSize].threadPitch,
    ) > 1e-9
  )
    context.addIssue({
      code: "custom",
      path: ["threadPitch"],
      message: "ISO 4032 requires the tabulated coarse pitch",
    })
}
function normalize<T extends z.output<z.ZodObject<typeof shape>>>(props: T) {
  return {
    ...props,
    threadPitch: hexNutDimensions[props.metricSize].threadPitch,
  }
}
export const hexNutModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(normalize)
export const hexNutModelDefinitionSchema = z
  .object({ fn: z.literal("hexnut"), ...shape })
  .strict()
  .superRefine(validate)
  .transform(normalize)
export type HexNutModelPropsInput = z.input<typeof hexNutModelPropsSchema>
export type HexNutModelProps = z.output<typeof hexNutModelPropsSchema>
export type HexNutModelDefinition = z.output<typeof hexNutModelDefinitionSchema>

/** Nominal dimensions in mm; lower mounting face is z=0, upper face z=height. */
export function getHexNutDimensions(input: HexNutModelPropsInput) {
  const props = hexNutModelPropsSchema.parse(input)
  const dims = hexNutDimensions[props.metricSize]
  const acrossCorners = (2 * dims.acrossFlats) / Math.sqrt(3)
  const boreMinorDiameter =
    dims.diameter - ((5 * Math.sqrt(3)) / 8) * dims.threadPitch
  return {
    ...dims,
    acrossCorners,
    boreMinorDiameter,
    faceDiameter: dims.acrossFlats,
    outerChamferAngle: 30,
    outerChamferDepth: (acrossCorners - dims.acrossFlats) / 2 / Math.sqrt(3),
    boreChamferAngle: 90,
    boreChamferDepth: (dims.mouthDiameter - boreMinorDiameter) / 2,
    bearingZ: 0,
    topZ: dims.height,
    threadDepth: dims.height,
  }
}
