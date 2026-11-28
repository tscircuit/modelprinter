import { parseGearToken } from "../../gear-parameter-schemas"
import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { filterRegulatorModelDefinitionSchema } from "./schema"

const lengths = {
  npt: "portNominal",
  w: "width",
  h: "height",
  depth: "depth",
  knobod: "knobOuterDiameter",
  paneld: "panelThreadDiameter",
  panelpitch: "panelThreadPitch",
} as const

export function parseFilterRegulatorModelString(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "filterregulator" ||
    tokens[0]?.toLowerCase() !== "filterregulator"
  ) {
    throw new Error("Expected filterregulator without an inline value")
  }
  const props: Record<string, unknown> = { fn: "filterregulator" }
  for (const token of tokens.slice(1)) {
    if (token.includes("(") || token.includes(")")) {
      throw new Error(
        `Parenthesized selector "${token}" is not supported for filterregulator`,
      )
    }
    const lower = token.toLowerCase()
    if (lower === "bottomdrain") {
      if (Object.hasOwn(props, "bottomDrain")) {
        throw new Error("Duplicate filterregulator bottomdrain flag")
      }
      props.bottomDrain = true
      continue
    }
    if (lower === "panelnut") {
      if (Object.hasOwn(props, "panelNut")) {
        throw new Error("Duplicate filterregulator panelnut flag")
      }
      props.panelNut = true
      continue
    }
    const [tokenName, tokenArg] = parseGearToken(token)
    if (tokenName in lengths) {
      if (!tokenArg) throw new Error(`Missing length value in "${token}"`)
      const property = lengths[tokenName as keyof typeof lengths]
      if (Object.hasOwn(props, property)) {
        throw new Error(`Duplicate filterregulator property "${property}"`)
      }
      props[property] = tokenArg
    } else {
      throw new Error(`Unknown filterregulator token "${token}"`)
    }
  }
  return filterRegulatorModelDefinitionSchema.parse(props)
}
