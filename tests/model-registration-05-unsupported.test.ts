import { test } from "bun:test"
import { assertUnsupportedErrors } from "./fixtures/assert-model-registration"

test("model registration unsupported", assertUnsupportedErrors)
