# Log

**21.01.24 17:45** After the initial research it seems that oddly enough there is no way to trivially get corresponding performance entry to a fetch call or vice versa. So I'll need to match those together myself. That can only be an approximation, I imagine, and not a perfect solution.

To-do:

- [ ] make sure instrumentation accepts call signature with `Request` as well.
- [ ] implement a way to reliably connect PerformanceEntries to Fetch calls.

Resources:

- https://web.dev/custom-metrics - mentions an API I didn't see anywhere else about buffering.
- https://w3c.github.io/performance-timeline - also documents that actually.

**21.01.25 10:11** I miss `assert` from node. Initial, naive version is implemented. Currently just taking all I can and storing it upon the span object which will later be logged out. Not optimal because a lot of it is not even serializable(ReadableStreams, etc), but I can deal with that later.

**21.01.25 11:21** Needed to test the order of which the PerformanceEntries are used. It didn't make sense to bundle all that logic into agent for now. I refactored agent to emit events instead, and make app log span ends out.

- [x] make sure that agent is not patching `fetch` multiple times.
