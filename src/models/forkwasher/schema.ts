import { z } from "zod"
import { positiveGearLengthSchema as positiveLength } from "../../gear-parameter-schemas"

const shape = {
  slotWidth: positiveLength,
  slotLength: positiveLength,
  width: positiveLength,
  length: positiveLength,
  thickness: positiveLength,
}
type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function slotDimensions(props: ResolvedProps) {
  const rootRadius = props.slotWidth / 2
  return { rootRadius, rootCenterY: props.slotLength - rootRadius }
}

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const issue = (path: keyof ResolvedProps, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })
  const halfWidth = props.width / 2
  const { rootRadius, rootCenterY } = slotDimensions(props)
  const rootEndY = rootCenterY + rootRadius
  if (halfWidth <= 0 || 2 * halfWidth !== props.width)
    issue(
      "width",
      "Washer width must have a positive, representable half-width",
    )
  if (
    rootRadius <= 0 ||
    2 * rootRadius !== props.slotWidth ||
    rootRadius >= halfWidth
  )
    issue(
      "slotWidth",
      "The slot must have a representable radius and leave material on both sides",
    )
  if (
    !(
      rootCenterY > 0 &&
      rootCenterY < props.slotLength &&
      rootEndY > rootCenterY
    )
  )
    issue(
      "slotLength",
      "The slot must have distinct straight sides and a rounded root",
    )
  if (props.slotLength >= props.length || rootEndY >= props.length)
    issue("slotLength", "The slot must leave material behind the rounded root")
}

export const forkWasherModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)
export const forkWasherModelDefinitionSchema = z
  .object({ fn: z.literal("forkwasher"), ...shape })
  .strict()
  .superRefine(validate)

export type ForkWasherModelPropsInput = z.input<
  typeof forkWasherModelPropsSchema
>
export type ForkWasherModelProps = z.output<typeof forkWasherModelPropsSchema>
export type ForkWasherModelDefinition = z.output<
  typeof forkWasherModelDefinitionSchema
>

/** The slot opens at Y=0 and the washer is centered on X. Dimensions are in millimeters. */
export function getForkWasherDimensions(input: ForkWasherModelPropsInput) {
  const props = forkWasherModelPropsSchema.parse(input)
  const slot = slotDimensions(props)
  const halfWidth = props.width / 2
  return {
    ...props,
    ...slot,
    sideWall: halfWidth - slot.rootRadius,
    backWall: props.length - props.slotLength,
    size: [props.width, props.length, props.thickness] as [
      number,
      number,
      number,
    ],
    bounds: {
      min: [-halfWidth, 0, 0] as [number, number, number],
      max: [halfWidth, props.length, props.thickness] as [
        number,
        number,
        number,
      ],
    },
    bottomZ: 0,
    topZ: props.thickness,
  }
}
