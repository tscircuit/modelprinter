import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

/** Standard/de-facto deep-groove bearing envelope designations; dimensions in mm.
 * The designation does not specify our nominal balls, cage, grooves or closures.
 */
export const ballBearingStandardSizes = {
  "608": { innerDiameter: 8, outerDiameter: 22, width: 7 },
  "625": { innerDiameter: 5, outerDiameter: 16, width: 5 },
  "624": { innerDiameter: 4, outerDiameter: 13, width: 5 },
  "6000": { innerDiameter: 10, outerDiameter: 26, width: 8 },
  "6001": { innerDiameter: 12, outerDiameter: 28, width: 8 },
  "6002": { innerDiameter: 15, outerDiameter: 32, width: 9 },
} as const
/** Preserve the original custom-envelope API and its three defaults. */
export const ballBearingDefaults = {
  innerDiameter: 8,
  outerDiameter: 22,
  width: 7,
} as const
export const ballBearingCodeSchema = z.enum([
  "608",
  "625",
  "624",
  "6000",
  "6001",
  "6002",
])
const positiveLength = z
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
  innerDiameter: positiveLength.optional(),
  outerDiameter: positiveLength.optional(),
  width: positiveLength.optional(),
  code: ballBearingCodeSchema.optional(),
  bothSidesOpen: z.boolean().optional(),
  bothSidesShielded: z.boolean().optional(),
  bothSidesSealed: z.boolean().optional(),
  topSideOpen: z.boolean().optional(),
  topSideShielded: z.boolean().optional(),
  topSideSealed: z.boolean().optional(),
  bottomSideOpen: z.boolean().optional(),
  bottomSideShielded: z.boolean().optional(),
  bottomSideSealed: z.boolean().optional(),
}
type Input = z.output<z.ZodObject<typeof shape>>
function resolve(input: Input, context: z.RefinementCtx) {
  const envelope =
    input.code === undefined
      ? ballBearingDefaults
      : ballBearingStandardSizes[input.code]
  const kinds = ["Open", "Shielded", "Sealed"] as const
  const globals = kinds.filter((kind) => input[`bothSides${kind}`] === true)
  if (globals.length > 1)
    context.addIssue({ code: "custom", message: "Both-side flags conflict" })
  const selectFace = (side: "top" | "bottom") => {
    const selected = kinds.filter(
      (kind) => input[`${side}Side${kind}`] === true,
    )
    const specified = kinds.some(
      (kind) => input[`${side}Side${kind}`] !== undefined,
    )
    if (selected.length > 1 || (specified && selected.length === 0))
      context.addIssue({
        code: "custom",
        message: `${side} face must select exactly one flag`,
      })
    return selected[0] ?? globals[0] ?? "Open"
  }
  const top = selectFace("top")
  const bottom = selectFace("bottom")
  const props = {
    innerDiameter: input.innerDiameter ?? envelope.innerDiameter,
    outerDiameter: input.outerDiameter ?? envelope.outerDiameter,
    width: input.width ?? envelope.width,
    topSideOpen: top === "Open",
    topSideShielded: top === "Shielded",
    topSideSealed: top === "Sealed",
    bottomSideOpen: bottom === "Open",
    bottomSideShielded: bottom === "Shielded",
    bottomSideSealed: bottom === "Sealed",
  }
  if (input.code !== undefined)
    for (const key of ["innerDiameter", "outerDiameter", "width"] as const)
      if (Math.abs(props[key] - envelope[key]) > 1e-9)
        context.addIssue({
          code: "custom",
          path: [key],
          message: `Dimension conflicts with bearing designation ${input.code}`,
        })
  if (props.innerDiameter >= props.outerDiameter)
    context.addIssue({
      code: "custom",
      path: ["innerDiameter"],
      message: "Inner diameter must be smaller than outer diameter",
    })
  return props
}
export const ballBearingModelPropsSchema = z
  .object(shape)
  .strict()
  .transform(resolve)
export const ballBearingModelDefinitionSchema = z
  .object({ fn: z.literal("ballbearing"), ...shape })
  .strict()
  .transform((input, context) => ({ fn: input.fn, ...resolve(input, context) }))
export type BallBearingModelPropsInput = z.input<
  typeof ballBearingModelPropsSchema
>
export type BallBearingModelProps = z.output<typeof ballBearingModelPropsSchema>
export type BallBearingModelDefinition = z.output<
  typeof ballBearingModelDefinitionSchema
>

/** Nominal visualization internals, not ISO raceways, load ratings or fits. */
export function getBallBearingDimensions(
  input: BallBearingModelPropsInput = {},
) {
  const props = ballBearingModelPropsSchema.parse(input)
  const boreRadius = props.innerDiameter / 2
  const outerRadius = props.outerDiameter / 2
  const pitchRadius = (boreRadius + outerRadius) / 2
  const ballCount = 8
  const ballRadius = Math.min(
    (outerRadius - boreRadius) * 0.28,
    props.width * 0.3,
    pitchRadius * Math.sin(Math.PI / ballCount) * 0.85,
  )
  const innerRaceOuterRadius = pitchRadius - 0.9 * ballRadius
  const outerRaceInnerRadius = pitchRadius + 0.9 * ballRadius
  const grooveRadius = 1.03 * ballRadius
  return {
    ...props,
    boreRadius,
    outerRadius,
    pitchRadius,
    ballCount,
    ballRadius,
    innerRaceOuterRadius,
    outerRaceInnerRadius,
    grooveRadius,
    grooveHalfWidth: ballRadius * Math.sqrt(1.03 ** 2 - 0.9 ** 2),
    rimChamfer: Math.min(
      props.width * 0.035,
      (innerRaceOuterRadius - boreRadius) * 0.1,
      (outerRadius - outerRaceInnerRadius) * 0.1,
    ),
    closureThickness: props.width * 0.1,
    cageInnerRadius: pitchRadius - 0.16 * ballRadius,
    cageOuterRadius: pitchRadius + 0.16 * ballRadius,
    cageSeparatorHalfAngle:
      Math.PI / ballCount - Math.asin((1.1 * ballRadius) / pitchRadius),
    midZ: props.width / 2,
  }
}
