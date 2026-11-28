import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { ballBushingBlockModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  id: "boreDiameter",
  l: "length",
  length: "length",
  w: "width",
  width: "width",
  h: "height",
  height: "height",
  holegridx: "holeGridX",
  holegridy: "holeGridY",
} as const

export function parseBallBushingBlockModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "ballbushingblock" ||
    tokens[0]?.toLowerCase() !== "ballbushingblock"
  ) {
    throw new Error("Expected ballbushingblock without an inline value")
  }
  const props: Record<string, unknown> = { fn: "ballbushingblock" }
  for (const token of tokens.slice(1)) {
    const gridTuple = token.match(/^holegrid\(([^,()]+),([^,()]+)\)$/i)
    if (gridTuple) {
      const [, rawX = "", rawY = ""] = gridTuple
      if (
        Object.hasOwn(props, "holeGridX") ||
        Object.hasOwn(props, "holeGridY")
      ) {
        throw new Error("Duplicate holegrid in ballbushingblock string")
      }
      props.holeGridX = rawX.trim()
      props.holeGridY = rawY.trim()
      continue
    }
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for ballbushingblock`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "closedrecirculating") {
      property = "closedRecirculating"
      parsed = true
    } else if (lower === "top4hole") {
      property = "top4Hole"
      parsed = true
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
        throw new Error(`Unknown ballbushingblock token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate ballbushingblock property "${property}"`)
    }
    props[property] = parsed
  }
  return ballBushingBlockModelDefinitionSchema.parse(props)
}
