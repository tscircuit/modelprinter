import { parseGearInteger, parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { selfAligningBallBearingModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  od: "outerDiameter",
  w: "width",
} as const

export function parseSelfAligningBallBearingModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "selfaligningballbearing" ||
    tokens[0]?.toLowerCase() !== "selfaligningballbearing"
  ) {
    throw new Error("Expected selfaligningballbearing without an inline value")
  }
  const props: Record<string, unknown> = { fn: "selfaligningballbearing" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for selfaligningballbearing`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "open" || lower === "sealed") {
      if (Object.hasOwn(props, "closure")) {
        throw new Error("Duplicate selfaligningballbearing closure flag")
      }
      props.closure = lower
      continue
    }
    if (lower === "sphericalouter") {
      if (Object.hasOwn(props, "sphericalOuter")) {
        throw new Error("Duplicate selfaligningballbearing sphericalouter flag")
      }
      props.sphericalOuter = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName === "rows") {
      if (!tokenArg) throw new Error(`Missing row count in "${token}"`)
      if (Object.hasOwn(props, "rows")) {
        throw new Error("Duplicate selfaligningballbearing rows")
      }
      props.rows = parseGearInteger(tokenArg, "rows")
    } else if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(
          `Duplicate selfaligningballbearing property "${property}"`,
        )
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown selfaligningballbearing token "${token}"`)
    }
  }
  return selfAligningBallBearingModelDefinitionSchema.parse(props)
}
