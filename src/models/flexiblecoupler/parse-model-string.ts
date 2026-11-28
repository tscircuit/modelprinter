import type { RawModelprinterParams } from "../../parse-model-string"
import { splitModelStringTokens } from "../../split-model-string-tokens"
import { flexibleCouplerModelDefinitionSchema } from "./schema"

const lengths = {
  bore: "boreDiameter",
  borea: "boreDiameter",
  borediameter: "boreDiameter",
  boreb: "boreBDiameter",
  borebdiameter: "boreBDiameter",
  od: "outerDiameter",
  outerdiameter: "outerDiameter",
  l: "length",
  length: "length",
  cutw: "cutWidth",
  cutwidth: "cutWidth",
} as const

export function parseFlexibleCouplerModelParams(raw: RawModelprinterParams) {
  const tokens = splitModelStringTokens(raw.string)
  if (
    raw.fn !== "flexiblecoupler" ||
    !/^flexiblecoupler$/i.test(tokens[0] ?? "")
  ) {
    throw new Error("Expected flexiblecoupler without an inline value")
  }

  const props: Record<string, unknown> = { fn: "flexiblecoupler" }
  const seen = new Set<string>()

  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    const name = match?.[1]?.toLowerCase()
    const value = match?.[2] ?? ""
    if (!name) {
      throw new Error(`Invalid flexible coupler token "${token}"`)
    }

    let property: string
    let parsed: unknown = value

    if (name === "helicalbeam") {
      property = "helicalBeam"
      if (value !== "") throw new Error("helicalbeam is a value-free flag")
      parsed = true
    } else if (name === "splitclamp") {
      property = "splitClamp"
      if (value !== "") throw new Error("splitclamp is a value-free flag")
      parsed = true
    } else if (name === "turns") {
      property = "turns"
      if (!/^\d+$/.test(value)) {
        throw new Error("Flexible coupler turns must be a positive integer")
      }
      parsed = Number(value)
    } else if (Object.hasOwn(lengths, name)) {
      property = lengths[name as keyof typeof lengths]
    } else {
      throw new Error(`Unknown flexible coupler token "${token}"`)
    }

    if (seen.has(property)) {
      throw new Error(`Duplicate flexible coupler property "${property}"`)
    }
    seen.add(property)
    props[property] = parsed
  }

  return flexibleCouplerModelDefinitionSchema.parse(props)
}
