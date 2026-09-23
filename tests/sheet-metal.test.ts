import { test } from "bun:test"
import { assertSheetMetal } from "./fixtures/assert-sheet-metal"
import { expectPngSnapshot } from "./fixtures/expect-png-snapshot"
import { renderSheetMetalSnapshot } from "./fixtures/render-sheet-metal-snapshot"

test("sheet metal plate, angle bracket and slotted U-channel", async () => {
  assertSheetMetal()
  await expectPngSnapshot(await renderSheetMetalSnapshot(), import.meta.path)
})
