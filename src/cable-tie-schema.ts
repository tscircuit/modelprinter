import { z } from "zod"
import { positiveModelLengthSchema } from "./model-length-schema"

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
  /** Strap length from the head's +X face to the insertion tip. */
  length: length,
  width: length,
  thickness: length,
  headLength: length,
  headWidth: length,
  headHeight: length,
  toothPitch: length,
  type: z.literal("nonrelease").default("nonrelease"),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function dimensions(props: ResolvedProps) {
  const tipLength = 2 * props.width
  const toothDepth = props.thickness / 4
  const passageLength = (6 * props.thickness) / 5
  const passageWidth = props.width + props.thickness / 5
  const minimumHeadWall = props.thickness / 2
  const toothCount = Math.floor((props.length - tipLength) / props.toothPitch)
  return {
    tipLength,
    tipStartX: props.length - tipLength,
    toothCount,
    toothedLength: toothCount * props.toothPitch,
    toothDepth,
    toothWidth: (4 * props.width) / 5,
    passageLength,
    passageWidth,
    passageCenterX: -props.headLength / 2,
    minimumHeadWall,
    pawlRootLength: props.thickness / 2,
    pawlThickness: props.thickness / 2,
    pawlWidth: (4 * props.width) / 5,
    pawlProtrusion: toothDepth,
    pawlCenterZ: props.headHeight / 2,
  }
}

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  const d = dimensions(props)
  if (Object.values(d).some((value) => !Number.isFinite(value))) {
    context.addIssue({
      code: "custom",
      message: "Derived cable tie dimensions must be finite",
    })
    return
  }
  if (
    d.toothDepth <= 0 ||
    d.toothWidth <= 0 ||
    d.minimumHeadWall <= 0 ||
    d.passageLength <= 0 ||
    d.passageWidth <= 0
  )
    context.addIssue({
      code: "custom",
      message: "Derived cable tie feature dimensions must be positive",
    })
  if (!Number.isSafeInteger(d.toothCount) || d.toothCount < 1)
    context.addIssue({
      code: "custom",
      path: ["length"],
      message: "Strap must accommodate its pointed tip and at least one tooth",
    })
  if (props.headLength < d.passageLength + 2 * d.minimumHeadWall)
    context.addIssue({
      code: "custom",
      path: ["headLength"],
      message: "Head length must enclose the passage and pawl root walls",
    })
  if (props.headWidth < d.passageWidth + 2 * d.minimumHeadWall)
    context.addIssue({
      code: "custom",
      path: ["headWidth"],
      message: "Head width must enclose the strap passage and side walls",
    })
  if (props.headHeight < 2 * props.thickness)
    context.addIssue({
      code: "custom",
      path: ["headHeight"],
      message: "Head height must be at least twice the strap thickness",
    })
}

/** Custom nominal tie in its flat, unfastened pose; see docs/cable-tie.md. */
export const cableTieModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)

export const cableTieModelDefinitionSchema = z
  .object({ fn: z.literal("cabletie"), ...shape })
  .strict()
  .superRefine(validate)

export type CableTieModelPropsInput = z.input<typeof cableTieModelPropsSchema>
export type CableTieModelProps = z.output<typeof cableTieModelPropsSchema>
export type CableTieModelDefinition = z.output<
  typeof cableTieModelDefinitionSchema
>

export const getCableTieDimensions = (input: CableTieModelPropsInput) =>
  dimensions(cableTieModelPropsSchema.parse(input))
