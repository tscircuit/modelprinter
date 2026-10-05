import { test } from "bun:test"
import { assertFlexScreenPitch } from "./fixtures/assert-flex-screen-pitch"

test(
  "flexscreens accept footprinter pin counts and pitch",
  assertFlexScreenPitch,
)
