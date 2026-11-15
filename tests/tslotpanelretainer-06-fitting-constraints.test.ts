import { expect, test } from "bun:test"
import { tSlotPanelRetainerModelPropsSchema } from "../src"
import { props } from "./fixtures/tslotpanelretainer"
test("tslotpanelretainer 6: fitting constraints produce readable issues", () => {
  for (const invalid of [
    { depth: 6 },
    { holeDiameter: 20 },
    { height: 11 },
    { height: 19 },
  ]) {
    const result = tSlotPanelRetainerModelPropsSchema.safeParse({
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
