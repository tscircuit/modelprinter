import { z } from "zod"
import { modelLengthSchema } from "./model-length-schema"
import type { RawModelprinterParams } from "./parse-model-string"
import { splitModelStringTokens } from "./split-model-string-tokens"

export const pneumaticLength = z
  .union([
    z.number().finite(),
    z
      .string()
      .regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:mm|cm|m|in|inch|mil|ft)?$/i)
      .transform((value) => value.toLowerCase()),
  ])
  .pipe(modelLengthSchema)
export const positiveLength = pneumaticLength.refine(
  (value) => value > 0,
  "Expected a positive length",
)
export const nonnegativeLength = pneumaticLength.refine(
  (value) => value >= 0,
  "Expected a nonnegative length",
)
export const pneumaticAngle = z.union([
  z.number().finite(),
  z
    .string()
    .regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)deg$/i)
    .transform(NumberFromDegrees),
])
function NumberFromDegrees(value: string) {
  return Number(value.slice(0, -3))
}
export const pneumaticCount = z
  .union([z.number(), z.string().regex(/^\d+$/).transform(Number)])
  .pipe(z.number().int().positive())

// Pipe sizes are nominal designations. They must never be passed to the length parser.
export const pneumaticThread = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^(?:(?:#?\d{1,2}-\d{1,2})(?:unf|unc|unef)?|m[1-9]\d*(?:\.\d+)?(?:x[0-9]+(?:\.\d+)?)?|(?:g|r|rc)[1-9]\d*(?:\/[1-9]\d*)?|[1-9]\d*(?:\/[1-9]\d*)?(?:npt|nptf|ptf|bspp|bspt))$/,
    "Expected a pneumatic thread designation such as 10-32, M5x0.8, G1/8 or 1/8NPT",
  )
  .transform((value) => value.replace(/^#/, ""))

// Model-local token maps keep the common parser independent of pneumatic model names.
export function parsePneumaticModelParams(
  raw: RawModelprinterParams,
  name: string,
  values: Record<string, string>,
  argumentsByToken: Record<string, string>,
  flags: Record<string, string | readonly [string, string]>,
) {
  const [first, ...tokens] = splitModelStringTokens(raw.string)
  if (first?.toLowerCase() !== name)
    throw new Error(`Expected ${name} without an inline value`)
  const props: Record<string, unknown> = { fn: name }
  for (const token of tokens) {
    const parsed = /^([a-z]+)(.*)$/i.exec(token)
    const key = parsed?.[1]?.toLowerCase() ?? ""
    const suffix = parsed?.[2] ?? ""
    let property: string
    let value: unknown
    if (Object.hasOwn(flags, key) && !suffix) {
      const flag = flags[key]!
      property = typeof flag === "string" ? flag : flag[0]
      value = typeof flag === "string" ? true : flag[1]
    } else if (
      Object.hasOwn(argumentsByToken, key) &&
      /^\([^()]+\)$/.test(suffix)
    ) {
      property = argumentsByToken[key]!
      value = suffix.slice(1, -1)
    } else if (Object.hasOwn(values, key) && /^[+-]?(?:\d|\.)/.test(suffix)) {
      property = values[key]!
      value = suffix
    } else {
      throw new Error(`Unknown or malformed ${name} token "${token}"`)
    }
    if (Object.hasOwn(props, property))
      throw new Error(`Duplicate or conflicting ${name} property "${property}"`)
    props[property] = value
  }
  return props
}
