import { z } from "zod"
import { positiveGearLengthSchema as positiveLength } from "../../gear-parameter-schemas"

const shape = {
  holeWidth: positiveLength,
  outerDiameter: positiveLength,
  thickness: positiveLength,
}
type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function holeCornerRadius(holeWidth: number) {
  const halfSide = holeWidth / 2
  return Math.hypot(halfSide, halfSide)
}

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const issue = (path: keyof ResolvedProps, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })
  const outside = props.outerDiameter / 2
  const halfSide = props.holeWidth / 2
  if (outside <= 0 || 2 * outside !== props.outerDiameter)
    issue(
      "outerDiameter",
      "Outside diameter must have a positive, representable radius",
    )
  if (halfSide <= 0 || 2 * halfSide !== props.holeWidth)
    issue(
      "holeWidth",
      "The opening must have a positive, representable half-width",
    )
  else if (
    props.outerDiameter / props.holeWidth <= Math.SQRT2 ||
    holeCornerRadius(props.holeWidth) >= outside
  )
    issue(
      "holeWidth",
      "The square opening must leave material at all four corners",
    )
}

export const squareHoleWasherModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const squareHoleWasherModelDefinitionSchema = z
  .object({ fn: z.literal("squareholewasher"), ...shape })
  .strict()
  .superRefine(validate)

export type SquareHoleWasherModelPropsInput = z.input<
  typeof squareHoleWasherModelPropsSchema
>
export type SquareHoleWasherModelProps = z.output<
  typeof squareHoleWasherModelPropsSchema
>
export type SquareHoleWasherModelDefinition = z.output<
  typeof squareHoleWasherModelDefinitionSchema
>

/** The nominal disk and square opening share an XY center. The opening is
 * aligned with X and Y. Z=0..thickness, in millimeters.
 */
export function getSquareHoleWasherDimensions(
  input: SquareHoleWasherModelPropsInput,
) {
  const props = squareHoleWasherModelPropsSchema.parse(input)
  const outerRadius = props.outerDiameter / 2
  const cornerRadius = holeCornerRadius(props.holeWidth)
  return {
    ...props,
    holeDiagonal: 2 * cornerRadius,
    minimumWall: outerRadius - cornerRadius,
    size: [props.outerDiameter, props.outerDiameter, props.thickness] as [
      number,
      number,
      number,
    ],
    bounds: {
      min: [-outerRadius, -outerRadius, 0] as [number, number, number],
      max: [outerRadius, outerRadius, props.thickness] as [
        number,
        number,
        number,
      ],
    },
    bottomZ: 0,
    topZ: props.thickness,
  }
}
