/** Underscores separate tokens only outside feature parentheses. */
export function splitModelStringTokens(value: string): string[] {
  const tokens: string[] = []
  let depth = 0
  let start = 0
  for (let index = 0; index < value.length; index++) {
    const character = value[index]
    if (character === "(") depth++
    if (character === ")") depth--
    if (depth < 0 || depth > 1) throw new Error("Invalid feature parentheses")
    if (character === "_" && depth === 0) {
      tokens.push(value.slice(start, index))
      start = index + 1
    }
  }
  if (depth !== 0) throw new Error("Unclosed feature parentheses")
  tokens.push(value.slice(start))
  if (tokens.some((token) => !token))
    throw new Error("Model strings cannot contain empty tokens")
  return tokens
}
