import { z } from "zod"
import { modelLengthSchema } from "../../model-length-schema"

const length = z
  .union([
    z.number().finite(),
    z
      .string()
      .regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i),
  ])
  .pipe(modelLengthSchema)
const positiveLength = length.refine(
  (value) => value > 0,
  "Length must be positive",
)

// Pad controls use the same compact tokens as the U.FL footprint. Dimensions
// of the unmated receptacle itself are a standard nominal envelope, not a
// claim about the plug, cable, RF performance, or a particular manufacturer.
const shape = {
  groundPitch: positiveLength.default(3),
  groundPadWidth: positiveLength.default(2.2),
  groundPadHeight: positiveLength.default(1.1),
  signalPadWidth: positiveLength.default(1.5),
  signalPadHeight: positiveLength.default(1.1),
  signalPadX: length
    .refine((value) => value < 0, "Signal pad must lie on the -X side")
    .default(-1.25),
}

export const uflModelPropsSchema = z.object(shape).strict()
export const uflModelDefinitionSchema = z
  .object({ fn: z.literal("ufl"), ...shape })
  .strict()
export type UflModelPropsInput = z.input<typeof uflModelPropsSchema>
export type UflModelProps = z.output<typeof uflModelPropsSchema>
export type UflModelDefinition = z.output<typeof uflModelDefinitionSchema>

/** Unmated SMT receptacle: +Z mating axis; ground terminals on +/-Y, RF on -X. */
export function getUflDimensions(input: UflModelPropsInput = {}) {
  const p = uflModelPropsSchema.parse(input)
  const groundDepth = Math.min(p.groundPadHeight, 0.3)
  const signalDepth = Math.min(p.signalPadWidth, 0.3)
  return {
    ...p,
    baseWidth: 2.6,
    baseLength: 2.6,
    baseHeight: 0.35,
    height: 1.25,
    shellOuterDiameter: 2,
    // The catalog calls out the envelope; internal contacts are simplified
    // visual geometry rather than additional mating-tolerance promises.
    shellInnerDiameter: 1.5,
    dielectricHeight: 0.85,
    centerPinDiameter: 0.5,
    centerPinHeight: 1.15,
    terminalThickness: 0.1,
    groundTerminalWidth: Math.min(p.groundPadWidth, 1.8),
    groundTerminalDepth: groundDepth,
    groundTerminalY: (p.groundPitch - groundDepth) / 2,
    signalTerminalWidth: signalDepth,
    signalTerminalHeight: Math.min(p.signalPadHeight, 0.6),
    signalTerminalX: p.signalPadX - signalDepth / 2,
    rearTabX: 1.4,
    rearTabWidth: 0.3,
    rearTabHeight: 0.6,
    bottomZ: 0,
    topZ: 1.25,
  }
}
