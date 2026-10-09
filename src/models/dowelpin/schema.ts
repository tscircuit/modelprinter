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
  .refine((value) => value > 0, "Length must be positive")

/** ISO 8734:1997 Table 1 approximate axial end-lead lengths c, in millimeters.
 * Figure 1 uses an approximately 15-degree end lead; optional rounded/dimpled
 * manufacturer ends are not represented. See docs/dowel-pin.md.
 */
export const dowelPinEndLeadLengths = {
  "1": 0.2,
  "1.5": 0.3,
  "2": 0.35,
  "2.5": 0.4,
  "3": 0.5,
  "4": 0.63,
  "5": 0.8,
  "6": 1.2,
  "8": 1.6,
  "10": 2,
  "12": 2.5,
  "16": 3,
  "20": 3.5,
} as const
/** Tabulated nominal lengths through 100 mm; no commercial d-by-l claim. */
export const dowelPinNominalLengths = [
  3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 22, 24, 26, 28, 30, 32, 35, 40, 45, 50, 55,
  60, 65, 70, 75, 80, 85, 90, 95, 100,
] as const
const diameterValues = Object.keys(dowelPinEndLeadLengths).map(Number)
const near = (a: number, b: number) => Math.abs(a - b) <= 1e-9
function selectedDiameter(diameter: number) {
  return diameterValues.find((value) => near(value, diameter))
}
const shape = {
  /** The pinned ISO contract is the default and cannot be disabled. */
  iso8734: z.literal(true).default(true),
  diameter: length,
  /** Overall distance between the two flat end planes, including leads. */
  length,
  endLeadLength: length.optional(),
  endLeadAngle: z.number().finite().positive().optional(),
}
type RawProps = z.output<z.ZodObject<typeof shape>>
function validate(props: RawProps, context: z.RefinementCtx) {
  const issue = (path: string, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })
  const diameter = selectedDiameter(props.diameter)
  if (diameter === undefined) {
    issue("diameter", "Diameter must be a supported ISO 8734 nominal value")
    return
  }
  const c =
    dowelPinEndLeadLengths[
      String(diameter) as keyof typeof dowelPinEndLeadLengths
    ]
  if (!dowelPinNominalLengths.some((value) => near(value, props.length)))
    issue(
      "length",
      "Length must be a tabulated nominal value from 3 through 100 mm",
    )
  if (props.length <= 2 * c)
    issue("length", "Length must separate the two fixed end leads")
  if (props.endLeadLength !== undefined && !near(props.endLeadLength, c))
    issue(
      "endLeadLength",
      "End lead contradicts the selected ISO 8734 diameter",
    )
  if (props.endLeadAngle !== undefined && !near(props.endLeadAngle, 15))
    issue(
      "endLeadAngle",
      "The visual ISO 8734 end lead uses the fixed approximate 15-degree angle",
    )
}
function resolve<T extends RawProps>(props: T) {
  const diameter = selectedDiameter(props.diameter)!
  return {
    ...props,
    diameter,
    length: dowelPinNominalLengths.find((value) => near(value, props.length))!,
    endLeadLength:
      dowelPinEndLeadLengths[
        String(diameter) as keyof typeof dowelPinEndLeadLengths
      ],
    endLeadAngle: 15 as const,
  }
}
export const dowelPinModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(resolve)
export const dowelPinModelDefinitionSchema = z
  .object({ fn: z.literal("dowelpin"), ...shape })
  .strict()
  .superRefine(validate)
  .transform(resolve)
export type DowelPinModelPropsInput = z.input<typeof dowelPinModelPropsSchema>
export type DowelPinModelProps = z.output<typeof dowelPinModelPropsSchema>
export type DowelPinModelDefinition = z.output<
  typeof dowelPinModelDefinitionSchema
>
/** Nominal visual envelope; lower end Z=0, upper end Z=length. */
export function getDowelPinDimensions(input: DowelPinModelPropsInput) {
  const props = dowelPinModelPropsSchema.parse(input)
  return {
    ...props,
    endDiameter:
      props.diameter -
      2 * props.endLeadLength * Math.tan((props.endLeadAngle * Math.PI) / 180),
    bearingZ: 0,
    topZ: props.length,
  }
}
