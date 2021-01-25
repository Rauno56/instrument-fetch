# Log

**21.01.24 17:45** After the initial research it seems that oddly enough there is no way to trivially get corresponding performance entry to a fetch call or vice versa. So I'll need to match those together myself. That can only be an approximation, I imagine, and not a perfect solution.

To-do:

- [x] make sure instrumentation accepts call signature with `Request` as well.
- [x] implement a way to reliably connect `PerformanceResourceTiming`(PRT) to Fetch calls.

Resources:

- https://web.dev/custom-metrics - mentions an API I didn't see anywhere else about buffering.
- https://w3c.github.io/performance-timeline - also documents that actually.

**21.01.25 10:11** I miss `assert` from node. Initial, naive version is implemented. Currently just taking all I can and storing it upon the span object which will later be logged out. Not optimal because a lot of it is not even serializable(ReadableStreams, etc), but I can deal with that later.

**21.01.25 11:21** Needed to test the order of which the `unusedSpans` are used. It didn't make sense to bundle all that logic into agent for now. I refactored agent to emit events instead, and make app log span ends out.

- [x] make sure that agent is not patching `fetch` multiple times.

**21.01.25 11:46** For correlating PRTs I'll start with filtering start and end times(graph in w3 became handy for sorting those out).

Resources:

- https://www.w3.org/TR/resource-timing-2/

**21.01.25 13:05** The situation seemed worse than it was, when there's a sequence of rapid requests done. I didn't initially think the browser will start to throttel those from such a small number. That actually makes matching PRTs more reliable because there can ever be only a few requests with the same url.

**21.01.25 14:15** Finished implementing `fetch(req: Request)`. `span.options` is empty if the user opts in using defaults. It would be useful and more consistent to always populate `span.options`.

- [x] make `span.options` reflect default options, if user didn't provide any.

**21.01.25 14:28** Since Request constructor makes the url absolute by itself, I could just opt in storing the Request object instead of options and solve the consistency of options as well as making sure the url is always in the same format. Win! Since `options` it's always an instance of `Request`, I will rename this as well.

I did discover that the task specified different interface for the spans, so I need to fix that.

- [x] make sure span follows the interface in the spec.

**21.01.25 14:52** I think I'll stop here for now since the initial requirements are fullfilled.

- [x] Capture fetch requests;
- [x] Match resource timings;
- [x] Is not perfect.

If I would continue, my next step would probably be to define a Span class to clean up the implementation and create some structure around the data and test how CORS preflight requests behave.
