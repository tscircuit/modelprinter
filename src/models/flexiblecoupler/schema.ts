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

const turnCount = z.number().int().min(1).max(Number.MAX_SAFE_INTEGER)

const shape = {
  /** Primary shaft bore diameter in millimeters. */
  boreDiameter: length,
  /** Optional secondary shaft bore diameter in millimeters (defaults to boreDiameter). */
  boreBDiameter: length.optional(),
  /** Outer cylindrical diameter in millimeters. */
  outerDiameter: length,
  /** Overall coupler length in millimeters. */
  length,
  /** Number of flexible helical-beam turns. */
  turns: turnCount,
  /** Axial width of each helical cut slot in millimeters. */
  cutWidth: length,
  /** Helical-beam flexible coupling style contract. */
  helicalBeam: z.literal(true).default(true),
  /** Split-clamp hub mounting contract. */
  splitClamp: z.literal(true).default(true),
}

type RawProps = z.output<z.ZodObject<typeof shape>>

function resolve<T extends RawProps>(props: T) {
  return {
    ...props,
    boreBDiameter: props.boreBDiameter ?? props.boreDiameter,
  }
}

function validate(props: RawProps, context: z.RefinementCtx) {
  const p = resolve(props)
  const issue = (path: string, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })

  if (Math.max(p.boreDiameter, p.boreBDiameter) >= p.outerDiameter) {
    issue(
      "outerDiameter",
      "Outer diameter must exceed both shaft bore diameters",
    )
  }
  const flexZoneLength = p.turns * p.cutWidth
  if (!Number.isFinite(flexZoneLength) || flexZoneLength >= p.length) {
    issue(
      "cutWidth",
      "Total helical cut span (turns * cutWidth) must be smaller than overall length",
    )
  }
}

export const flexibleCouplerModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
  .transform(resolve)

export const flexibleCouplerModelDefinitionSchema = z
  .object({ fn: z.literal("flexiblecoupler"), ...shape })
  .strict()
  .superRefine(validate)
  .transform(resolve)

export type FlexibleCouplerModelPropsInput = z.input<
  typeof flexibleCouplerModelPropsSchema
>
export type FlexibleCouplerModelProps = z.output<
  typeof flexibleCouplerModelPropsSchema
>
export type FlexibleCouplerModelDefinition = z.output<
  typeof flexibleCouplerModelDefinitionSchema
>

/** Nominal helical-beam flexible coupler envelope and hub depths in millimeters. */
export function getFlexibleCouplerDimensions(
  input: FlexibleCouplerModelPropsInput,
) {
  const props = flexibleCouplerModelPropsSchema.parse(input)
  const flexZoneLength = props.turns * props.cutWidth
  return {
    ...props,
    minimumWallThickness:
      (props.outerDiameter -
        Math.max(props.boreDiameter, props.boreBDiameter)) /
      2,
    flexZoneLength,
    hubLength: (props.length - flexZoneLength) / 2,
    boreADepth: props.length / 2,
    boreBDepth: props.length / 2,
  }
}
