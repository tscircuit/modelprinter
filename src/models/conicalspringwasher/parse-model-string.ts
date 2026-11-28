import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { conicalSpringWasherModelDefinitionSchema } from "./schema"

const lengths = {
  id: "innerDiameter",
  od: "outerDiameter",
  strip: "stripThickness",
  freeh: "freeHeight",
} as const

export function parseConicalSpringWasherModelString(
  raw: RawModelprinterParams,
) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "conicalspringwasher" ||
    tokens[0]?.toLowerCase() !== "conicalspringwasher"
  ) {
    throw new Error("Expected conicalspringwasher without an inline value")
  }
  const props: Record<string, unknown> = { fn: "conicalspringwasher" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for conicalspringwasher`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "conical") {
      if (Object.hasOwn(props, "conical")) {
        throw new Error("Duplicate conicalspringwasher conical flag")
      }
      props.conical = true
      continue
    }
    if (lower === "freestate") {
      if (Object.hasOwn(props, "freeState")) {
        throw new Error("Duplicate conicalspringwasher freestate flag")
      }
      props.freeState = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate conicalspringwasher property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown conicalspringwasher token "${token}"`)
    }
  }
  return conicalSpringWasherModelDefinitionSchema.parse(props)
}
