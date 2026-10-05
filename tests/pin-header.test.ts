import { test } from "bun:test"
import { assertPinHeader } from "./fixtures/assert-pin-header"

test("Male pin header parameter contract", assertPinHeader)
