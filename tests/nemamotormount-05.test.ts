import { expect, test } from "bun:test"
import { mp } from "../src"

test("nemamotormount parser rejects malformed, duplicated and manufacturer-specific tokens", () => {
  for (const string of [
    "nemamotormount17",
    "nemamotormount_nema17_nemasize17",
    "nemamotormount_w50mm_width50mm",
    "nemamotormount_nema17.0",
    "nemamotormount_nema17mm",
    "nemamotormount_nema24",
    "nemamotormount__w50mm",
    "nemamotormount_t",
    "nemamotormount_width50mmjunk",
    "nemamotormount_shaft23mm_shaftclearance23mm",
    "nemamotormount_span31mm_mountspan31mm",
    "nemamotormount_vendor(example)",
    "nemamotormount_nema17nanotec",
    "nemamotormount_angle45deg",
    "nemamotormount_mountslots2",
  ])
    expect(() => mp.string(string).json(), string).toThrow()
})
