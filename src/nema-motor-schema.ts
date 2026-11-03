import {
  getJstMotorConnector,
  jstMotorWireConnectionSchema,
} from "./jst-motor-connector"
import { z } from "zod"
import { fitsNemaCircle, clearsNemaCircle } from "./nema-motor-profile"
import {
  hexSocketBoltDimensions,
  metricBoltSizeSchema,
} from "./hex-socket-bolt-schema"
import {
  positiveModelLengthSchema as positive,
  nonnegativeModelLengthSchema as nonnegative,
} from "./model-length-schema"

export const nemaSizeSchema = z.union([
  z.literal(8),
  z.literal(17),
  z.literal(23),
  z.literal(34),
])
export type NemaSize = z.infer<typeof nemaSizeSchema>

/** Representative motors, not dimensions guaranteed by a frame name.
 * Mounting/pilot/shaft references: Nanotec SCA2018, ST4118 and ST5918 drawings:
 * https://www.nanotec.com/fileadmin/files/Baureihenuebersichten/Schrittmotoren/Product_Overview_SCA2018.pdf
 * https://www.nanotec.com/fileadmin/files/Baureihenuebersichten/Schrittmotoren/Product_Overview_ST4118.pdf
 * https://www.nanotec.com/fileadmin/files/Baureihenuebersichten/Schrittmotoren/Product_Overview_ST5918.pdf
 * NEMA 34 envelope, mounting/pilot and shaft: STEPPERONLINE 34HS31-6004S1:
 * https://www.omc-stepperonline.com/download/34HS31-6004S1.pdf
 * Its shaft keyway is omitted; the default shaft is round.
 * Cap thicknesses, chamfers and D cuts are illustrative, configurable details.
 * NEMA 8 also has 15.4 mm pitch / 16 mm pilot variants; override both together.
 */
export const nemaMotorDimensions = {
  8: {
    backFaceScrewSize: "M2",
    backFaceHoleDepth: 2,
    bodyWidth: 20.3,
    bodyLength: 33,
    mountingHoleSpacing: 16,
    mountingHoleDiameter: 2,
    mountingHoleDepth: 2,
    mountingHoleThrough: false,
    pilotDiameter: 15,
    pilotLength: 1.5,
    shaftDiameter: 4,
    shaftLength: 15,
    roundShaft: true,
    dShaft: false,
    shaftFlatDepth: 0.5,
    shaftFlatLength: 10,
    shaftFlatAngle: 0,
    frontCapLength: 3.5,
    rearCapLength: 3.5,
    faceCornerChamfer: 0.5,
    bodyCornerChamfer: 3,
  },
  17: {
    backFaceScrewSize: "M3",
    backFaceHoleDepth: 4.5,
    bodyWidth: 42.3,
    bodyLength: 38,
    mountingHoleSpacing: 31,
    mountingHoleDiameter: 3,
    mountingHoleDepth: 4.5,
    mountingHoleThrough: false,
    pilotDiameter: 22,
    pilotLength: 2,
    shaftDiameter: 5,
    shaftLength: 24,
    roundShaft: false,
    dShaft: true,
    shaftFlatDepth: 0.5,
    shaftFlatLength: 15,
    shaftFlatAngle: 0,
    frontCapLength: 5,
    rearCapLength: 5,
    faceCornerChamfer: 3,
    bodyCornerChamfer: 6,
  },
  23: {
    // Representative side-tab rear pattern from STEPPERONLINE's ST-M10 adapter.
    // The adapter's R5/R2.5 profile is a visual reference, not a frame guarantee:
    // https://www.omc-stepperonline.com/image/catalog/dimensions/ST-M10_Dimension.svg
    backFaceHoleSpacing: 50,
    backFaceHoleSpacingY: 32,
    rearCornerChamfer: 9 * Math.SQRT2,
    rearCornerRecessRadius: 5,
    rearCornerFilletRadius: 2.5,
    backFaceScrewSize: "M3",
    backFaceHoleDepth: 4.5,
    bodyWidth: 56.4,
    bodyLength: 51,
    mountingHoleSpacing: 47.14,
    mountingHoleDiameter: 5,
    mountingHoleDepth: 5,
    mountingHoleThrough: true,
    pilotDiameter: 38.1,
    pilotLength: 1.6,
    shaftDiameter: 6.35,
    shaftLength: 20.6,
    roundShaft: false,
    dShaft: true,
    shaftFlatDepth: 0.5,
    shaftFlatLength: 15,
    shaftFlatAngle: 0,
    frontCapLength: 5,
    rearCapLength: 5,
    faceCornerChamfer: 2,
    bodyCornerChamfer: 9 * Math.SQRT2,
    bodyCornerRecessRadius: 5,
    bodyCornerFilletRadius: 2.5,
    chamferedBodyCornerChamfer: 15,
  },
  34: {
    // Illustrative rear details; independent of the mounting flange.
    backFaceHoleSpacing: 40,
    rearCornerChamfer: 24,
    backFaceScrewSize: "M5",
    backFaceHoleDepth: 6,
    bodyWidth: 86,
    bodyLength: 80,
    mountingHoleSpacing: 69.6,
    mountingHoleDiameter: 6.5,
    mountingHoleDepth: 10,
    mountingHoleThrough: true,
    pilotDiameter: 73,
    pilotLength: 1.6,
    shaftDiameter: 14,
    shaftLength: 32,
    roundShaft: true,
    dShaft: false,
    shaftFlatDepth: 0.5,
    shaftFlatLength: 15,
    shaftFlatAngle: 0,
    frontCapLength: 10,
    rearCapLength: 8,
    faceCornerChamfer: 2,
    bodyCornerChamfer: 24,
  },
} as const

const shape = {
  nemaSize: nemaSizeSchema,
  /** Rear cap at Z=-bodyLength: bare, open bores or installed cap screws. */
  backFacePlain: z.boolean().optional(),
  backFaceHoles: z.boolean().optional(),
  backFaceScrews: z.boolean().optional(),
  backFaceHoleSpacing: positive.optional(),
  /** Axis overrides; the legacy scalar still sets a square pattern when supplied. */
  backFaceHoleSpacingX: positive.optional(),
  backFaceHoleSpacingY: positive.optional(),
  backFaceHoleDiameter: positive.optional(),
  backFaceHoleDepth: positive.optional(),
  backFaceScrewSize: metricBoltSizeSchema.optional(),
  /** Visual termination; the wireside reference exists even when hidden. */
  noWires: z.boolean().optional(),
  wireStubs: z.boolean().optional(),
  /** JST catalog designation, mutually exclusive with the visible-wire flags. */
  wireConnection: jstMotorWireConnectionSchema.optional(),
  /** Counterclockwise angle about local +Z; 0 is the +X side. */
  wireSideAngle: z.number().finite().optional(),
  wireLength: positive.optional(),
  wireDiameter: positive.optional(),
  wireCount: z.number().int().min(2).max(8).optional(),
  bodyWidth: positive.optional(),
  bodyLength: positive.optional(),
  mountingHoleSpacing: positive.optional(),
  mountingHoleDiameter: positive.optional(),
  mountingHoleDepth: positive.optional(),
  mountingHoleThrough: z.boolean().optional(),
  pilotDiameter: positive.optional(),
  pilotLength: positive.optional(),
  /** Distance from mounting face Z=0 to shaft tip, including pilot height. */
  shaftLength: positive.optional(),
  shaftDiameter: positive.optional(),
  roundShaft: z.boolean().optional(),
  dShaft: z.boolean().optional(),
  /** Radial material removed from the +X side before rotation. */
  shaftFlatDepth: nonnegative.optional(),
  /** Flat extends back from the tip; leaves a round shoulder above the pilot. */
  shaftFlatLength: nonnegative.optional(),
  /** Degrees around +Z, counterclockwise; zero puts the flat on +X. */
  shaftFlatAngle: z.number().finite().optional(),
  frontCapLength: positive.optional(),
  rearCapLength: positive.optional(),
  faceCornerChamfer: nonnegative.optional(),
  bodyCornerChamfer: nonnegative.optional(),
  bodyCornerRecessRadius: nonnegative.optional(),
  bodyCornerFilletRadius: nonnegative.optional(),
  /** Rear outline is independent of the front mounting flange. */
  rearCornerChamfer: nonnegative.optional(),
  rearCornerRecessRadius: nonnegative.optional(),
  rearCornerFilletRadius: nonnegative.optional(),
  rearChamfered: z.boolean().optional(),
  rearStepped: z.boolean().optional(),
  chamfered: z.boolean().optional(),
  stepped: z.boolean().optional(),
}
const resolve = (
  p: z.output<z.ZodObject<typeof shape>>,
  ctx: z.RefinementCtx,
) => {
  const select = <K extends keyof typeof p>(
    flags: readonly K[],
    fallback: K,
  ) => {
    const selected = flags.filter((flag) => p[flag] === true)
    const specified = flags.some((flag) => p[flag] !== undefined)
    if (selected.length > 1 || (specified && selected.length === 0))
      ctx.addIssue({
        code: "custom",
        message: `Select exactly one of ${flags.join(", ")}`,
      })
    return selected[0] ?? fallback
  }
  const back = select(
    ["backFacePlain", "backFaceHoles", "backFaceScrews"],
    p.nemaSize === 34 ? "backFacePlain" : "backFaceScrews",
  )
  const shaft = select(
    ["roundShaft", "dShaft"],
    nemaMotorDimensions[p.nemaSize].roundShaft ? "roundShaft" : "dShaft",
  )
  const corner = select(
    ["chamfered", "stepped"],
    p.nemaSize === 23 || p.nemaSize === 34 ? "stepped" : "chamfered",
  )
  const rearCorner = select(
    ["rearChamfered", "rearStepped"],
    p.chamfered === true
      ? "rearChamfered"
      : p.nemaSize === 23 || corner === "stepped"
        ? "rearStepped"
        : "rearChamfered",
  )
  const wireSpecified =
    p.noWires !== undefined ||
    p.wireStubs !== undefined ||
    p.wireConnection !== undefined
  const wireSelections =
    Number(p.noWires === true) +
    Number(p.wireStubs === true) +
    Number(p.wireConnection !== undefined)
  if (wireSelections > 1 || (wireSpecified && wireSelections === 0))
    ctx.addIssue({
      code: "custom",
      message:
        "Select exactly one of noWires, wireStubs or a JST wireConnection",
    })
  const d = nemaMotorDimensions[p.nemaSize]
  const bodyCornerChamfer =
    p.bodyCornerChamfer ??
    (corner === "chamfered" && "chamferedBodyCornerChamfer" in d
      ? d.chamferedBodyCornerChamfer
      : d.bodyCornerChamfer)
  const defaultBodyRadius = Math.min(4, bodyCornerChamfer / Math.SQRT2 / 4)
  const backFaceScrewSize = p.backFaceScrewSize ?? d.backFaceScrewSize
  const screw = hexSocketBoltDimensions[backFaceScrewSize]
  const backFaceHoleSpacing =
    p.backFaceHoleSpacing ??
    ("backFaceHoleSpacing" in d
      ? d.backFaceHoleSpacing
      : (p.mountingHoleSpacing ?? d.mountingHoleSpacing))
  const rearCornerChamfer =
    p.rearCornerChamfer ??
    (p.nemaSize === 23 && rearCorner === "rearChamfered"
      ? (p.faceCornerChamfer ?? d.faceCornerChamfer)
      : "rearCornerChamfer" in d
        ? d.rearCornerChamfer
        : back === "backFacePlain" &&
            (p.mountingHoleThrough ?? d.mountingHoleThrough)
          ? (p.bodyCornerChamfer ?? d.bodyCornerChamfer)
          : (p.faceCornerChamfer ?? d.faceCornerChamfer))
  const defaultRearRadius = Math.min(4, rearCornerChamfer / Math.SQRT2 / 4)
  // Keep NEMA23's wire exit on the front (-Y) side without turning its
  // rectangular rear screw pattern. Other frames retain their wire sides.
  const defaultWireAngle = p.nemaSize === 23 ? 270 : p.nemaSize === 34 ? 90 : 0
  return {
    nemaSize: p.nemaSize,
    noWires: p.noWires === true,
    wireStubs: p.wireStubs === true || !wireSpecified,
    ...(p.wireConnection !== undefined
      ? { wireConnection: p.wireConnection }
      : {}),
    wireSideAngle: (((p.wireSideAngle ?? defaultWireAngle) % 360) + 360) % 360,
    wireLength: p.wireLength ?? (p.nemaSize === 34 ? 25 : 6),
    wireDiameter: p.wireDiameter ?? (p.nemaSize === 34 ? 2 : 1.2),
    wireCount: p.wireCount ?? 4,
    backFacePlain: back === "backFacePlain",
    backFaceHoles: back === "backFaceHoles",
    backFaceScrews: back === "backFaceScrews",
    backFaceHoleSpacing,
    backFaceHoleSpacingX: p.backFaceHoleSpacingX ?? backFaceHoleSpacing,
    backFaceHoleSpacingY:
      p.backFaceHoleSpacingY ??
      p.backFaceHoleSpacing ??
      ("backFaceHoleSpacingY" in d
        ? d.backFaceHoleSpacingY
        : backFaceHoleSpacing),
    backFaceHoleDiameter: p.backFaceHoleDiameter ?? screw.diameter,
    backFaceHoleDepth: p.backFaceHoleDepth ?? d.backFaceHoleDepth,
    backFaceScrewSize,
    bodyWidth: p.bodyWidth ?? d.bodyWidth,
    bodyLength: p.bodyLength ?? d.bodyLength,
    mountingHoleSpacing: p.mountingHoleSpacing ?? d.mountingHoleSpacing,
    mountingHoleDiameter: p.mountingHoleDiameter ?? d.mountingHoleDiameter,
    mountingHoleDepth: p.mountingHoleDepth ?? d.mountingHoleDepth,
    mountingHoleThrough: p.mountingHoleThrough ?? d.mountingHoleThrough,
    pilotDiameter: p.pilotDiameter ?? d.pilotDiameter,
    pilotLength: p.pilotLength ?? d.pilotLength,
    shaftDiameter: p.shaftDiameter ?? d.shaftDiameter,
    shaftLength: p.shaftLength ?? d.shaftLength,
    roundShaft: shaft === "roundShaft",
    dShaft: shaft === "dShaft",
    shaftFlatDepth: p.shaftFlatDepth ?? d.shaftFlatDepth,
    shaftFlatLength: p.shaftFlatLength ?? d.shaftFlatLength,
    shaftFlatAngle: p.shaftFlatAngle ?? d.shaftFlatAngle,
    frontCapLength: p.frontCapLength ?? d.frontCapLength,
    rearCapLength: p.rearCapLength ?? d.rearCapLength,
    faceCornerChamfer: p.faceCornerChamfer ?? d.faceCornerChamfer,
    bodyCornerChamfer,
    bodyCornerRecessRadius:
      p.bodyCornerRecessRadius ??
      ("bodyCornerRecessRadius" in d
        ? d.bodyCornerRecessRadius
        : defaultBodyRadius),
    bodyCornerFilletRadius:
      p.bodyCornerFilletRadius ??
      ("bodyCornerFilletRadius" in d
        ? d.bodyCornerFilletRadius
        : defaultBodyRadius),
    chamfered: corner === "chamfered",
    stepped: corner === "stepped",
    rearCornerChamfer,
    rearStepped: rearCorner === "rearStepped",
    rearChamfered: rearCorner === "rearChamfered",
    rearCornerRecessRadius:
      p.rearCornerRecessRadius ??
      ("rearCornerRecessRadius" in d
        ? d.rearCornerRecessRadius
        : defaultRearRadius),
    rearCornerFilletRadius:
      p.rearCornerFilletRadius ??
      ("rearCornerFilletRadius" in d
        ? d.rearCornerFilletRadius
        : defaultRearRadius),
  }
}
export type NemaMotorModelProps = ReturnType<typeof resolve>
const validate = (p: NemaMotorModelProps, ctx: z.RefinementCtx) => {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message })
  if (
    p.stepped &&
    p.bodyCornerRecessRadius + p.bodyCornerFilletRadius >
      p.bodyCornerChamfer / Math.SQRT2
  )
    issue("Body recess and fillet radii must fit within the corner shoulder")
  const rearChamfer =
    p.rearCornerChamfer ??
    (p.backFacePlain && p.mountingHoleThrough
      ? p.bodyCornerChamfer
      : p.faceCornerChamfer)
  const rearEdge = p.rearStepped ? rearChamfer / Math.SQRT2 : rearChamfer
  if (
    p.rearStepped &&
    p.rearCornerRecessRadius + p.rearCornerFilletRadius > rearEdge
  )
    issue("Rear recess and fillet radii must fit within the corner shoulder")
  if (!p.backFacePlain) {
    const screw = hexSocketBoltDimensions[p.backFaceScrewSize]
    const radius =
      (p.backFaceScrews
        ? Math.max(p.backFaceHoleDiameter, screw.headDiameter)
        : p.backFaceHoleDiameter) / 2
    if (
      p.backFaceHoleSpacingX <= 2 * radius ||
      p.backFaceHoleSpacingY <= 2 * radius
    )
      issue("Rear holes and screw heads must not overlap each other")
    if (
      !fitsNemaCircle(
        p.backFaceHoleSpacingX / 2,
        p.backFaceHoleSpacingY / 2,
        radius,
        {
          width: p.bodyWidth,
          chamfer: p.rearCornerChamfer,
          stepped: p.rearStepped,
          recessRadius: p.rearCornerRecessRadius,
          filletRadius: p.rearCornerFilletRadius,
        },
      )
    )
      issue("Rear holes and screw heads must fit entirely inside the rear face")
    if (p.backFaceHoleDepth >= p.rearCapLength)
      issue("Rear hole depth must be less than the rear cap length")
    if (p.backFaceScrews && p.backFaceHoleDiameter < screw.diameter)
      issue("Rear holes must accommodate the screw diameter")
  }
  if (p.wireStubs) {
    if (p.wireDiameter * p.wireCount * 1.5 > p.bodyWidth - 2 * rearEdge)
      issue("Wire bundle must fit on the cap side")
    if (p.wireDiameter >= p.rearCapLength)
      issue("Wire diameter must fit within the rear cap")
  }
  const connector =
    p.wireConnection === undefined
      ? undefined
      : getJstMotorConnector(p.wireConnection)
  if (connector && p.bodyWidth - 2 * rearEdge < connector.bodyWidth)
    issue("JST header must fit on the motor side")
  const r = p.mountingHoleDiameter / 2
  if (p.frontCapLength + p.rearCapLength >= p.bodyLength)
    issue("End caps must leave a positive body length")
  if (
    p.faceCornerChamfer >= p.bodyWidth / 2 ||
    p.bodyCornerChamfer >= p.bodyWidth / 2 ||
    rearChamfer >= p.bodyWidth / 2
  )
    issue("Chamfer must be smaller than half the body width")
  if (
    p.mountingHoleSpacing + 2 * r >= p.bodyWidth ||
    p.bodyWidth - p.faceCornerChamfer - p.mountingHoleSpacing <= r * Math.SQRT2
  )
    issue("Mounting holes must fit entirely inside the front face")
  if (p.pilotDiameter >= p.bodyWidth || p.pilotDiameter <= p.shaftDiameter)
    issue(
      "Pilot diameter must exceed the shaft diameter and fit inside the face",
    )
  if (p.mountingHoleSpacing / Math.SQRT2 <= p.pilotDiameter / 2 + r)
    issue("Mounting holes must clear the pilot")
  if (!p.mountingHoleThrough && p.mountingHoleDepth >= p.frontCapLength)
    issue("Blind mounting hole depth must be less than the front cap length")
  if (
    p.mountingHoleThrough &&
    !clearsNemaCircle(p.mountingHoleSpacing / 2, p.mountingHoleSpacing / 2, r, {
      width: p.bodyWidth,
      chamfer: p.bodyCornerChamfer,
      stepped: p.stepped,
      recessRadius: p.bodyCornerRecessRadius,
      filletRadius: p.bodyCornerFilletRadius,
    })
  )
    issue("Body must clear through front mounting holes")
  if (p.shaftLength <= p.pilotLength)
    issue("Shaft tip must extend beyond the pilot")
  if (
    p.dShaft &&
    (p.shaftFlatDepth <= 0 ||
      p.shaftFlatDepth >= p.shaftDiameter / 2 ||
      p.shaftFlatLength <= 0 ||
      p.shaftFlatLength > p.shaftLength - p.pilotLength)
  )
    issue(
      "D flat must have positive depth less than the shaft radius and fit above the pilot",
    )
}

export const nemaMotorModelPropsSchema = z
  .object(shape)
  .strict()
  .transform(resolve)
  .superRefine(validate)
export const nemaMotorModelDefinitionSchema = z
  .object({ fn: z.literal("nema"), ...shape })
  .strict()
  .transform(({ fn, ...props }, ctx) => ({ fn, ...resolve(props, ctx) }))
  .superRefine(validate)
export type NemaMotorModelPropsInput = z.input<typeof nemaMotorModelPropsSchema>
export type NemaMotorModelDefinition = z.output<
  typeof nemaMotorModelDefinitionSchema
>
