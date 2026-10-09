import { z } from "zod"
import {
  nonnegativeGearLengthSchema as nonnegative,
  positiveGearLengthSchema as positive,
} from "../../gear-parameter-schemas"

const shape = {
  width: positive,
  /** Distance between the parallel inner and outer flat faces. */
  wallThickness: positive,
  length: positive,
  outerRadius: nonnegative.default(0),
  innerRadius: nonnegative.default(0),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function dimensions(props: ResolvedProps) {
  const innerWidth = props.width - 2 * props.wallThickness
  // The smallest support-plane separation is on an axis or a diagonal.
  const minimumWallThickness = Math.min(
    props.wallThickness,
    Math.SQRT2 * props.wallThickness -
      (Math.SQRT2 - 1) * (props.outerRadius - props.innerRadius),
  )
  const crossSectionArea =
    4 * props.wallThickness * (props.width - props.wallThickness) -
    (4 - Math.PI) *
      (props.outerRadius - props.innerRadius) *
      (props.outerRadius + props.innerRadius)
  return { innerWidth, minimumWallThickness, crossSectionArea }
}

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const { innerWidth, minimumWallThickness, crossSectionArea } =
    dimensions(props)
  if (innerWidth <= 0)
    context.addIssue({
      code: "custom",
      path: ["wallThickness"],
      message: "Wall thickness must leave a positive opening",
    })
  if (props.outerRadius > props.width / 2)
    context.addIssue({
      code: "custom",
      path: ["outerRadius"],
      message: "Outside corner radius cannot exceed half the outside width",
    })
  if (props.innerRadius > innerWidth / 2)
    context.addIssue({
      code: "custom",
      path: ["innerRadius"],
      message: "Inside corner radius cannot exceed half the opening width",
    })
  if (minimumWallThickness <= 0)
    context.addIssue({
      code: "custom",
      path: ["outerRadius"],
      message:
        "Corner radii must leave material between the inner and outer profiles",
    })
  if (
    !Number.isFinite(crossSectionArea) ||
    crossSectionArea <= 0 ||
    !Number.isFinite(minimumWallThickness)
  )
    context.addIssue({
      code: "custom",
      message: "Derived section dimensions must remain finite and positive",
    })
}

/** Custom concentric rounded-square profiles, extruded from Z=0 to Z=length. */
export const squareTubeModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const squareTubeModelDefinitionSchema = z
  .object({ fn: z.literal("squaretube"), ...shape })
  .strict()
  .superRefine(validate)

export type SquareTubeModelPropsInput = z.input<
  typeof squareTubeModelPropsSchema
>
export type SquareTubeModelProps = z.output<typeof squareTubeModelPropsSchema>
export type SquareTubeModelDefinition = z.output<
  typeof squareTubeModelDefinitionSchema
>

export function getSquareTubeDimensions(input: SquareTubeModelPropsInput) {
  const props = squareTubeModelPropsSchema.parse(input)
  return { ...props, ...dimensions(props) }
}
