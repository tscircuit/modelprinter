import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { tSlotJoinPlateModelDefinitionSchema } from "./schema"

const lengths = {
  l: "length",
  length: "length",
  w: "width",
  width: "width",
  t: "thickness",
  thickness: "thickness",
  p: "pitch",
  pitch: "pitch",
} as const

export function parseTSlotJoinPlateModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== "tslotjoinplate" || tokens[0]?.toLowerCase() !== raw.fn) {
    throw new Error("Expected tslotjoinplate without an inline argument")
  }
  const props: Record<string, unknown> = { fn: "tslotjoinplate" }
  for (const token of tokens.slice(1)) {
    const [tokenName, tokenArg] = parseGearToken(token)
    let property: string
    let parsed: unknown = tokenArg
    if (tokenName in lengths) {
      if (!tokenArg) {
        throw new Error(`Missing length argument in token "${token}"`)
      }
      property = lengths[tokenName as keyof typeof lengths]
    } else if (tokenName === "slots" || tokenName === "slotcount") {
      property = "slotCount"
      parsed = parseGearInteger(tokenArg, "slotCount")
    } else if (tokenName === "slot") {
      property = "slot"
      const tupleMatch = tokenArg.match(/^\(([^(),]+),([^(),]+)\)$/)
      if (!tupleMatch) {
        throw new Error("slot requires two parenthesized lengths")
      }
      parsed = [tupleMatch[1]!.trim(), tupleMatch[2]!.trim()]
    } else {
      throw new Error(`Unknown T-slot join plate token "${token}"`)
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`T-slot join plate property "${property}" is repeated`)
    }
    props[property] = parsed
  }
  return tSlotJoinPlateModelDefinitionSchema.parse(props)
}
