import { expect, test } from "bun:test"
import { slottedChannelModelPropsSchema } from "../src"
import { props } from "./fixtures/slottedchannel"
test("slottedchannel 6: fitting constraints produce readable issues", () => {
  for (const invalid of [
    { width: 12 },
    { height: 6 },
    { slotLength: 5 },
    { slotWidth: 28 },
    { pitch: 12 },
    { endOffset: 6 },
    { length: 71 },
  ]) {
    const result = slottedChannelModelPropsSchema.safeParse({
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
