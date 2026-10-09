import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

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
/** DIN 934 regular hex nuts, nominal visual envelopes in millimeters.
 * Nominal envelopes: https://www.boltdepot.com/fastener-information/nuts-washers/Metric-Nut-Dimensions.aspx
 * Mouth diameters are fixed visualization choices (1.08D), not tolerances.
 */
export const hexNutDinDimensions = {
  "M1.6": {
    diameter: 1.6,
    threadPitch: 0.35,
    acrossFlats: 3.2,
    height: 1.3,
    mouthDiameter: 1.728,
  },
  M2: {
    diameter: 2,
    threadPitch: 0.4,
    acrossFlats: 4,
    height: 1.6,
    mouthDiameter: 2.16,
  },
  "M2.5": {
    diameter: 2.5,
    threadPitch: 0.45,
    acrossFlats: 5,
    height: 2,
    mouthDiameter: 2.7,
  },
  M3: {
    diameter: 3,
    threadPitch: 0.5,
    acrossFlats: 5.5,
    height: 2.4,
    mouthDiameter: 3.24,
  },
  "M3.5": {
    diameter: 3.5,
    threadPitch: 0.6,
    acrossFlats: 6,
    height: 2.8,
    mouthDiameter: 3.78,
  },
  M4: {
    diameter: 4,
    threadPitch: 0.7,
    acrossFlats: 7,
    height: 3.2,
    mouthDiameter: 4.32,
  },
  M5: {
    diameter: 5,
    threadPitch: 0.8,
    acrossFlats: 8,
    height: 4,
    mouthDiameter: 5.4,
  },
  M6: {
    diameter: 6,
    threadPitch: 1,
    acrossFlats: 10,
    height: 5,
    mouthDiameter: 6.48,
  },
  M7: {
    diameter: 7,
    threadPitch: 1,
    acrossFlats: 11,
    height: 5.5,
    mouthDiameter: 7.56,
  },
  M8: {
    diameter: 8,
    threadPitch: 1.25,
    acrossFlats: 13,
    height: 6.5,
    mouthDiameter: 8.64,
  },
  M10: {
    diameter: 10,
    threadPitch: 1.5,
    acrossFlats: 17,
    height: 8,
    mouthDiameter: 10.8,
  },
  M12: {
    diameter: 12,
    threadPitch: 1.75,
    acrossFlats: 19,
    height: 10,
    mouthDiameter: 12.96,
  },
  M14: {
    diameter: 14,
    threadPitch: 2,
    acrossFlats: 22,
    height: 11,
    mouthDiameter: 15.12,
  },
  M16: {
    diameter: 16,
    threadPitch: 2,
    acrossFlats: 24,
    height: 13,
    mouthDiameter: 17.28,
  },
  M18: {
    diameter: 18,
    threadPitch: 2.5,
    acrossFlats: 27,
    height: 15,
    mouthDiameter: 19.44,
  },
  M20: {
    diameter: 20,
    threadPitch: 2.5,
    acrossFlats: 30,
    height: 16,
    mouthDiameter: 21.6,
  },
  M22: {
    diameter: 22,
    threadPitch: 2.5,
    acrossFlats: 32,
    height: 18,
    mouthDiameter: 23.76,
  },
  M24: {
    diameter: 24,
    threadPitch: 3,
    acrossFlats: 36,
    height: 19,
    mouthDiameter: 25.92,
  },
} as const
export const hexNutMetricSizeSchema = z.enum([
  "M1.6",
  "M2",
  "M2.5",
  "M3",
  "M3.5",
  "M4",
  "M5",
  "M6",
  "M7",
  "M8",
  "M10",
  "M12",
  "M14",
  "M16",
  "M18",
  "M20",
  "M22",
  "M24",
])
function inchNut(
  diameter: number,
  threadsPerInch: number,
  acrossFlats: number,
  height: number,
) {
  return {
    diameter: diameter * 25.4,
    threadPitch: 25.4 / threadsPerInch,
    threadsPerInch,
    acrossFlats: acrossFlats * 25.4,
    height: height * 25.4,
    mouthDiameter: diameter * 25.4 * 1.08,
  }
}
/** ASME B18.2.2 regular hex nut nominal visual envelopes; UNC coarse pitches.
 * Small numbered sizes use ASME B18.2.2 small-pattern hex envelopes.
 * Nominal inch envelopes: Bolt Depot US Nut Size Table (hex nut and
 * machine screw nut columns), not a maximum/tolerance table.
 * https://www.boltdepot.com/fastener-information/nuts-washers/US-Nut-Dimensions.aspx
 * All exported dimensions are millimeters. Mouths use the visual 1.08D rule.
 */
export const hexNutImperialDimensions = {
  "#2": inchNut(0.086, 56, 3 / 16, 1 / 16),
  "#4": inchNut(0.112, 40, 1 / 4, 3 / 32),
  "#6": inchNut(0.138, 32, 5 / 16, 7 / 64),
  "#8": inchNut(0.164, 32, 11 / 32, 1 / 8),
  "#10": inchNut(0.19, 24, 3 / 8, 1 / 8),
  "#12": inchNut(0.216, 24, 7 / 16, 5 / 32),
  "1/4": inchNut(1 / 4, 20, 7 / 16, 7 / 32),
  "5/16": inchNut(5 / 16, 18, 1 / 2, 17 / 64),
  "3/8": inchNut(3 / 8, 16, 9 / 16, 21 / 64),
  "7/16": inchNut(7 / 16, 14, 11 / 16, 3 / 8),
  "1/2": inchNut(1 / 2, 13, 3 / 4, 7 / 16),
  "5/8": inchNut(5 / 8, 11, 15 / 16, 35 / 64),
  "3/4": inchNut(3 / 4, 10, 1 + 1 / 8, 41 / 64),
  "7/8": inchNut(7 / 8, 9, 1 + 5 / 16, 3 / 4),
  "1": inchNut(1, 8, 1 + 1 / 2, 55 / 64),
} as const
export const hexNutImperialSizeSchema = z.enum([
  "#2",
  "#4",
  "#6",
  "#8",
  "#10",
  "#12",
  "1/4",
  "5/16",
  "3/8",
  "7/16",
  "1/2",
  "5/8",
  "3/4",
  "7/8",
  "1",
])
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
  iso4032: z.boolean().optional(),
  din934: z.boolean().optional(),
  asmeb1822: z.boolean().optional(),
  metricSize: hexNutMetricSizeSchema.optional(),
  imperialSize: hexNutImperialSizeSchema.optional(),
  threadPitch: length.optional(),
  threadHand: z.literal("right").default("right"),
  threadClass: z.enum(["6H", "2B"]).optional(),
  showThreads: z.boolean().default(true),
}
type RawProps = z.output<z.ZodObject<typeof shape>>
function selectedFamily(props: RawProps) {
  if (props.iso4032 || props.din934 || props.asmeb1822)
    return {
      iso4032: props.iso4032 === true,
      din934: props.din934 === true,
      asmeb1822: props.asmeb1822 === true,
    }
  const asmeb1822 = !!props.imperialSize
  const din934 =
    !asmeb1822 && !!props.metricSize && !(props.metricSize in hexNutDimensions)
  return { iso4032: !asmeb1822 && !din934, din934, asmeb1822 }
}
function selectedDimensions(props: RawProps) {
  const family = selectedFamily(props)
  if (family.asmeb1822)
    return props.imperialSize
      ? hexNutImperialDimensions[props.imperialSize]
      : undefined
  if (!props.metricSize) return undefined
  return family.din934
    ? hexNutDinDimensions[props.metricSize]
    : hexNutDimensions[props.metricSize as keyof typeof hexNutDimensions]
}
function validate(props: RawProps, context: z.RefinementCtx) {
  const issue = (path: string, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })
  if (!!props.metricSize === !!props.imperialSize)
    issue("metricSize", "Select exactly one metric or imperial size")
  const flags = ["iso4032", "din934", "asmeb1822"] as const
  const family = selectedFamily(props)
  if (flags.filter((flag) => props[flag] === true).length > 1)
    issue("iso4032", "Select only one ISO, DIN or ASME family")
  for (const flag of flags)
    if (family[flag] && props[flag] === false)
      issue(
        flag,
        "The size-default family cannot be disabled without selecting another family",
      )
  const dims = selectedDimensions(props)
  if (!dims)
    issue(
      "metricSize",
      "The selected ISO, DIN or ASME family does not support this size",
    )
  if (
    dims &&
    props.threadPitch !== undefined &&
    Math.abs(props.threadPitch - dims.threadPitch) > 1e-9
  )
    issue("threadPitch", "Hex nuts require the tabulated coarse pitch")
  const threadClass = selectedFamily(props).asmeb1822 ? "2B" : "6H"
  if (props.threadClass && props.threadClass !== threadClass)
    issue("threadClass", `The selected standard requires ${threadClass}`)
}
function normalize<T extends RawProps>(props: T) {
  return {
    ...props,
    ...selectedFamily(props),
    threadPitch: selectedDimensions(props)!.threadPitch,
    threadClass:
      props.threadClass ??
      (selectedFamily(props).asmeb1822 ? ("2B" as const) : ("6H" as const)),
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
  const dims = selectedDimensions(props)!
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
