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
  panelHoleDiameter: length,
  innerDiameter: length,
  outerDiameter: length,
  height: length,
  grooveWidth: length,
  /** Radial recess from the flange outside diameter. */
  grooveDepth: length,
  shape: z.literal("symmetricring").default("symmetricring"),
}

type ResolvedProps = z.output<z.ZodObject<typeof shape>>

function validate(props: ResolvedProps, context: z.RefinementCtx) {
  if (
    props.innerDiameter >= props.panelHoleDiameter ||
    props.panelHoleDiameter >= props.outerDiameter
  )
    context.addIssue({
      code: "custom",
      path: ["panelHoleDiameter"],
      message: "Diameters must satisfy ID < panel hole < OD",
    })
  if (props.grooveWidth >= props.height)
    context.addIssue({
      code: "custom",
      path: ["grooveWidth"],
      message: "Groove width must leave two positive-thickness flanges",
    })
  const rootDiameter = props.outerDiameter - 2 * props.grooveDepth
  const tolerance = 1e-9 * props.outerDiameter
  if (
    !Number.isFinite(rootDiameter) ||
    Math.abs(rootDiameter - props.panelHoleDiameter) > tolerance
  )
    context.addIssue({
      code: "custom",
      path: ["grooveDepth"],
      message: "Panel hole must equal OD minus twice the radial groove depth",
    })
  if (
    (rootDiameter - props.innerDiameter) / 2 <= 0 ||
    (props.height - props.grooveWidth) / 2 <= 0
  )
    context.addIssue({
      code: "custom",
      message: "Derived root wall and flange thicknesses must be positive",
    })
}

/** Custom symmetric, square-shouldered ring; lengths normalize to millimeters. */
export const cableGrommetModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)

export const cableGrommetModelDefinitionSchema = z
  .object({ fn: z.literal("cablegrommet"), ...shape })
  .strict()
  .superRefine(validate)

export type CableGrommetModelPropsInput = z.input<
  typeof cableGrommetModelPropsSchema
>
export type CableGrommetModelProps = z.output<
  typeof cableGrommetModelPropsSchema
>
export type CableGrommetModelDefinition = z.output<
  typeof cableGrommetModelDefinitionSchema
>

export function getCableGrommetDimensions(input: CableGrommetModelPropsInput) {
  const props = cableGrommetModelPropsSchema.parse(input)
  const grooveRootDiameter = props.outerDiameter - 2 * props.grooveDepth
  return {
    grooveRootDiameter,
    flangeThickness: (props.height - props.grooveWidth) / 2,
    minimumWallThickness: (grooveRootDiameter - props.innerDiameter) / 2,
    grooveStartZ: -props.grooveWidth / 2,
    grooveEndZ: props.grooveWidth / 2,
  }
}
