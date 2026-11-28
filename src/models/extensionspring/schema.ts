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
  /** Custom extension spring construction contract. */
  custom: z.literal(true).default(true),
  /** Outer coil diameter in millimeters. */
  outerDiameter: length,
  /** Wire diameter in millimeters. */
  wireDiameter: length,
  /** Close-wound coil body length in millimeters. */
  bodyLength: length,
  /** Number of active close-wound turns. */
  turns: turnCount,
  /** Inside diameter of each full-circle end hook in millimeters. */
  hookInnerDiameter: length,
  /** Full-circle end hook geometry contract. */
  fullCircleHook: z.literal(true).default(true),
  /** Whether end hooks lie in the same plane (true) or perpendicular planes (false). */
  hooksAligned: z.boolean().default(true),
  /** Winding handedness (false = right-handed, true = left-handed). */
  leftHanded: z.boolean().default(false),
  /** Free unloaded spring state contract. */
  free: z.literal(true).default(true),
}

type RawProps = z.output<z.ZodObject<typeof shape>>

function validate(props: RawProps, context: z.RefinementCtx) {
  const issue = (path: string, message: string) =>
    context.addIssue({ code: "custom", path: [path], message })

  if (props.outerDiameter <= 2 * props.wireDiameter) {
    issue(
      "outerDiameter",
      "Outer diameter must exceed twice the wire diameter to leave a positive bore",
    )
  }
  const minBodyLength = props.turns * props.wireDiameter
  if (!Number.isFinite(minBodyLength) || props.bodyLength < minBodyLength) {
    issue(
      "bodyLength",
      "Body length must be at least turns * wireDiameter for close-wound coils",
    )
  }
  if (props.hookInnerDiameter > props.outerDiameter - props.wireDiameter) {
    issue(
      "hookInnerDiameter",
      "Hook inner diameter cannot exceed mean coil diameter (outerDiameter - wireDiameter)",
    )
  }
}

export const extensionSpringModelPropsSchema = z
  .object(shape)
  .strict()
  .superRefine(validate)

export const extensionSpringModelDefinitionSchema = z
  .object({ fn: z.literal("extensionspring"), ...shape })
  .strict()
  .superRefine(validate)

export type ExtensionSpringModelPropsInput = z.input<
  typeof extensionSpringModelPropsSchema
>
export type ExtensionSpringModelProps = z.output<
  typeof extensionSpringModelPropsSchema
>
export type ExtensionSpringModelDefinition = z.output<
  typeof extensionSpringModelDefinitionSchema
>

/** Nominal extension spring envelope in millimeters. */
export function getExtensionSpringDimensions(
  input: ExtensionSpringModelPropsInput,
) {
  const props = extensionSpringModelPropsSchema.parse(input)
  return {
    ...props,
    insideDiameter: props.outerDiameter - 2 * props.wireDiameter,
    meanDiameter: props.outerDiameter - props.wireDiameter,
    overallFreeLength:
      props.bodyLength + 2 * (props.hookInnerDiameter + props.wireDiameter),
  }
}
