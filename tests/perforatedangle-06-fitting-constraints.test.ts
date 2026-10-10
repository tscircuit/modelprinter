import { expect, test } from "bun:test"
import { perforatedAngleModelPropsSchema } from "../src"
import { props } from "./fixtures/perforatedangle"
test("perforatedangle 6: fitting constraints produce readable issues", () => {
  for (const invalid of [
    { innerRadius: 22 },
    { legOffset: 8 },
    { legOffset: 24 },
    { pitch: 6 },
    { endOffset: 3 },
    { length: 68 },
  ]) {
    const result = perforatedAngleModelPropsSchema.safeParse({
      ...props,
      ...invalid,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.every((issue) => issue.path.length > 0)).toBe(
        true,
      )
      expect(result.error.issues[0]!.message.length).toBeGreaterThan(20)
    }
  }
})
