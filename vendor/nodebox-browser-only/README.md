# Browser-only runtime adapter

This is original MIT-licensed DevUI Bits code, not a Nodebox implementation.
Sandpack's client package supports both browser React and Node.js runtimes.
DevUI Bits exclusively uses its browser React runtime. The npm override replaces
the unused Nodebox dependency, whose Sustainable Use License has additional
restrictions, without modifying Sandpack's Apache-licensed code.

The adapter exports the import names required by Sandpack's unused Node client
and throws a clear error if a developer attempts to enable a Node.js template.
Node.js/server sandbox templates are outside this project's supported features.
All browser React editor features are covered by the Playwright tests.
