import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { camLatchModelDefinitionSchema } from "./schema"

const lengths = {
  cutout: "cutoutDiameter",
  cutoutd: "cutoutDiameter",
  threadpitch: "threadPitch",
  barrell: "barrelLength",
  barrellength: "barrelLength",
  headod: "headOuterDiameter",
  headouterdiameter: "headOuterDiameter",
  caml: "camLength",
  camw: "camWidth",
  camt: "camThickness",
} as const

export function parseCamLatchModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "camlatch" || tokens[0]?.toLowerCase() !== "camlatch") {
    throw new Error("Expected camlatch without an inline value")
  }
  const props: Record<string, unknown> = { fn: "camlatch" }
  for (const token of tokens.slice(1)) {
    const camTuple = token.match(/^cam\(([^,()]+),([^,()]+),([^,()]+)\)$/i)
    if (camTuple) {
      const [, rawL = "", rawW = "", rawT = ""] = camTuple
      if (
        Object.hasOwn(props, "camLength") ||
        Object.hasOwn(props, "camWidth") ||
        Object.hasOwn(props, "camThickness")
      ) {
        throw new Error("Duplicate cam dimensions in camlatch string")
      }
      props.camLength = rawL.trim()
      props.camWidth = rawW.trim()
      props.camThickness = rawT.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for camlatch`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "slotdrive" || lower === "slotted") {
      property = "slotDrive"
      parsed = true
    } else if (lower === "turn90deg" || lower === "turn90") {
      property = "turnAngle"
      parsed = 90
    } else if (/^m(?:\d+(?:\.\d+)?)$/i.test(lower)) {
      property = "thread"
      parsed = lower
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown camlatch token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate camlatch property "${property}"`)
    }
    props[property] = parsed
  }
  return camLatchModelDefinitionSchema.parse(props)
}
