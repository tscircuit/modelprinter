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

export const cableGlandMetricSizeSchema = z.enum([
  "M12",
  "M16",
  "M20",
  "M25",
  "M32",
  "M40",
  "M50",
  "M63",
])

const shape = {
  /** Metric mounting thread designation (e.g. M20). */
  metricSize: cableGlandMetricSizeSchema,
  /** Metric thread pitch in millimeters (standard 1.5 mm fine pitch). */
  threadPitch: length.default(1.5),
  /** Centered cable passage diameter in millimeters. */
  cableDiameter: length,
  /** Length of the externally threaded mounting barrel in millimeters. */
  barrelLength: length,
  /** Overall axial height of the cable gland in millimeters. */
  height: length,
  /** Across-flats width of the wrenching hex body in millimeters. */
  hexWidth: length,
  /** Outer diameter of the compression cap in millimeters. */
  capOuterDiameter: length,
  /** Compression-style panel gland contract. */
  compression: z.literal(true).default(true),
}

type RawProps = z.output<z.ZodObject<typeof shape>>

function validate(props: RawProps, context: z.RefinementCtx) {
  const nominalThreadDiameter = Number(props.metricSize.slice(1))
  const issue = (path: string, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })

  if (nominalThreadDiameter - 1.226869 * props.threadPitch <= 0) {
    issue(
      "threadPitch",
      "Thread pitch must leave a positive external-thread root diameter",
    )
  }
  if (props.cableDiameter >= nominalThreadDiameter) {
    issue(
      "cableDiameter",
      "Cable passage diameter must be smaller than the nominal thread diameter",
    )
  }
  if (props.barrelLength >= props.height) {
    issue(
      "barrelLength",
      "Barrel length must be smaller than overall cable gland height",
    )
  }
  if (props.hexWidth <= nominalThreadDiameter) {
    issue(
      "hexWidth",
      "Hex wrenching width must exceed the nominal thread diameter",
    )
  }
  if (props.capOuterDiameter <= props.cableDiameter) {
    issue(
      "capOuterDiameter",
      "Compression cap outer diameter must exceed the cable passage diameter",
    )
  }
}

export const cableGlandModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)

export const cableGlandModelDefinitionSchema = z
  .object({ fn: z.literal("cablegland"), ...shape })
  .strict()
  .superRefine(validate)

export type CableGlandModelPropsInput = z.input<
  typeof cableGlandModelPropsSchema
>
export type CableGlandModelProps = z.output<typeof cableGlandModelPropsSchema>
export type CableGlandModelDefinition = z.output<
  typeof cableGlandModelDefinitionSchema
>

/** Nominal cable gland envelope; panel bearing plane Z=0, barrel extends to -barrelLength. */
export function getCableGlandDimensions(input: CableGlandModelPropsInput) {
  const props = cableGlandModelPropsSchema.parse(input)
  const nominalThreadDiameter = Number(props.metricSize.slice(1))
  return {
    ...props,
    nominalThreadDiameter,
    barrelBottomZ: -props.barrelLength,
    bearingZ: 0,
    topZ: props.height,
    abovePanelHeight: props.height - props.barrelLength,
  }
}
