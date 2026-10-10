import { expect, test } from "bun:test"
import { zeeBarModelPropsSchema } from "../src"
import { props } from "./fixtures/zeebar"
test("zeebar 6: fitting constraints produce readable issues", () => {
  for (const invalid of [{ upperWidth: 4 }, { lowerWidth: 4 }, { height: 8 }]) {
    const result = zeeBarModelPropsSchema.safeParse({ ...props, ...invalid })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.every((issue) => issue.path.length > 0)).toBe(
        true,
      )
      expect(result.error.issues[0]!.message.length).toBeGreaterThan(20)
    }
  }
})
