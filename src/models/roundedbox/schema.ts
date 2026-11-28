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

const shape = {
  /** Outer box width along X in millimeters. */
  width: length,
  /** Outer box depth along Y in millimeters. */
  depth: length,
  /** Open box body height along Z in millimeters (excluding lid). */
  height: length,
  /** Constant wall and bottom floor thickness in millimeters. */
  wallThickness: length,
  /** Positive outside corner radius in millimeters. */
  cornerRadius: length,
  /** Separate flat screw-on lid contract. */
  screwOnLid: z.literal(true).default(true),
  /** Lid plate thickness in millimeters. */
  lidThickness: length,
  /** Four corner mounting screws. */
  screwCount: z.literal(4).default(4),
  /** Screw clearance hole diameter in millimeters. */
  holeDiameter: length,
  /** Center-to-center hole pitch along X in millimeters. */
  holePitchX: length,
  /** Center-to-center hole pitch along Y in millimeters. */
  holePitchY: length,
  /** Corner mounting boss diameter in millimeters. */
  bossDiameter: length,
}

type RawProps = z.output<z.ZodObject<typeof shape>>

function validate(props: RawProps, context: z.RefinementCtx) {
  const issue = (path: string, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })

  if (2 * props.wallThickness >= Math.min(props.width, props.depth)) {
    issue(
      "wallThickness",
      "Wall thickness must leave a positive interior cavity",
    )
  }
  if (props.wallThickness >= props.height) {
    issue("wallThickness", "Floor thickness must be smaller than box height")
  }
  if (props.cornerRadius <= props.wallThickness) {
    issue(
      "cornerRadius",
      "Outside corner radius must exceed wall thickness for constant-wall rounded interior corners",
    )
  }
  if (2 * props.cornerRadius >= Math.min(props.width, props.depth)) {
    issue(
      "cornerRadius",
      "Twice the corner radius must be smaller than both outer width and depth",
    )
  }
  if (props.holeDiameter >= props.bossDiameter) {
    issue(
      "holeDiameter",
      "Screw hole diameter must be smaller than corner boss diameter",
    )
  }
  if (
    props.holePitchX <= props.bossDiameter ||
    props.holePitchX + props.bossDiameter >
      props.width - 2 * props.wallThickness
  ) {
    issue(
      "holePitchX",
      "Hole pitch X must keep corner bosses separated and inside the inner cavity walls",
    )
  }
  if (
    props.holePitchY <= props.bossDiameter ||
    props.holePitchY + props.bossDiameter >
      props.depth - 2 * props.wallThickness
  ) {
    issue(
      "holePitchY",
      "Hole pitch Y must keep corner bosses separated and inside the inner cavity walls",
    )
  }
}

export const roundedBoxModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)

export const roundedBoxModelDefinitionSchema = z
  .object({ fn: z.literal("roundedbox"), ...shape })
  .strict()
  .superRefine(validate)

export type RoundedBoxModelPropsInput = z.input<
  typeof roundedBoxModelPropsSchema
>
export type RoundedBoxModelProps = z.output<typeof roundedBoxModelPropsSchema>
export type RoundedBoxModelDefinition = z.output<
  typeof roundedBoxModelDefinitionSchema
>

/** Nominal rounded enclosure cavity, inner corner radius and boss centers in millimeters. */
export function getRoundedBoxDimensions(input: RoundedBoxModelPropsInput) {
  const props = roundedBoxModelPropsSchema.parse(input)
  const hx = props.holePitchX / 2
  const hy = props.holePitchY / 2
  return {
    ...props,
    innerWidth: props.width - 2 * props.wallThickness,
    innerDepth: props.depth - 2 * props.wallThickness,
    innerHeight: props.height - props.wallThickness,
    innerCornerRadius: props.cornerRadius - props.wallThickness,
    totalHeight: props.height + props.lidThickness,
    bossCenters: [
      [-hx, -hy],
      [hx, -hy],
      [hx, hy],
      [-hx, hy],
    ] as const,
  }
}
