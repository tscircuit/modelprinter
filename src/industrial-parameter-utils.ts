import { z } from "zod"
import { modelLengthSchema } from "./model-length-schema"
import type { RawModelprinterParams } from "./parse-model-string"
import { splitModelStringTokens } from "./split-model-string-tokens"

/** Finite decimal lengths in millimeters; explicit common units are accepted. */
export const industrialLengthSchema = z
  .union([
    z.number().finite(),
    z
      .string()
      .regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)

/** Model-local aliases select typed schema fields; unknown/duplicate tokens fail. */
export function parseIndustrialModelParams<Schema extends z.ZodTypeAny>(
  raw: RawModelprinterParams,
  name: string,
  schema: Schema,
  aliases: Readonly<Record<string, string>>,
  flags: Readonly<Record<string, string>> = {},
): z.output<Schema> {
  const tokens = splitModelStringTokens(raw.string)
  if (raw.fn !== name || tokens[0]?.toLowerCase() !== name)
    throw new Error(`Expected ${name} without an inline value`)
  const props: Record<string, unknown> = { fn: name }
  for (const token of tokens.slice(1)) {
    const match = token.match(/^([a-z]+)(.*)$/i)
    if (!match) throw new Error(`Invalid ${name} token "${token}"`)
    const key = match[1]!.toLowerCase()
    const value = match[2]!
    let property: string
    let parsed: unknown
    if (Object.hasOwn(flags, key)) {
      property = flags[key]!
      if (value !== "") throw new Error(`${key} is a value-free flag`)
      parsed = true
    } else if (Object.hasOwn(aliases, key)) {
      property = aliases[key]!
      if (
        !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft|feet)?$/i.test(
          value,
        )
      )
        throw new Error(`Invalid ${name} value "${token}"`)
      parsed = /[a-z]/i.test(value) ? value : Number(value)
    } else throw new Error(`Unknown ${name} token "${token}"`)
    if (Object.hasOwn(props, property))
      throw new Error(`${name} property "${property}" is set more than once`)
    props[property] = parsed
  }
  return schema.parse(props)
}
