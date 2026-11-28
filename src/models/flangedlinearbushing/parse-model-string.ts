import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { flangedLinearBushingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  bore: "innerDiameter",
  od: "outerDiameter",
  l: "length",
  length: "length",
  flangeod: "flangeOuterDiameter",
  pcd: "pitchCircleDiameter",
  boltpcd: "pitchCircleDiameter",
  holed: "holeDiameter",
  hole: "holeDiameter",
} as const

export function parseFlangedLinearBushingModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "flangedlinearbushing" ||
    tokens[0]?.toLowerCase() !== "flangedlinearbushing"
  ) {
    throw new Error("Expected flangedlinearbushing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "flangedlinearbushing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for flangedlinearbushing`,
      )
    }
    const lower = token.toLowerCase()
    let property: string
    let parsed: unknown
    if (lower === "closedrecirculating") {
      property = "closedRecirculating"
      parsed = true
    } else if (lower === "round4hole") {
      property = "round4Hole"
      parsed = true
    } else {
      const [tokenName, tokenArg] = parseGearToken(token)
      if (tokenName in lengths) {
        if (!tokenArg) {
          throw new Error(`Missing length value in token "${token}"`)
        }
        property = lengths[tokenName as keyof typeof lengths]
        parsed = tokenArg
      } else {
        throw new Error(`Unknown flangedlinearbushing token "${token}"`)
      }
    }
    if (Object.hasOwn(props, property)) {
      throw new Error(`Duplicate flangedlinearbushing property "${property}"`)
    }
    props[property] = parsed
  }
  return flangedLinearBushingModelDefinitionSchema.parse(props)
}
