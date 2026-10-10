import { expect, test } from "bun:test"
import { hatSectionModelPropsSchema } from "../src"
import { props } from "./fixtures/hatsection"
test("hatsection 6: fitting constraints produce readable issues", () => {
  for (const invalid of [{ crownWidth: 8 }, { height: 8 }, { lipWidth: 2 }]) {
    const result = hatSectionModelPropsSchema.safeParse({
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
