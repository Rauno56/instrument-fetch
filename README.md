Serve the files somehow:

```
cd bbhw
http-server -p21337 .
```

Capture and log all fetch requests done by the app. Use agent.js to patch(monkey-patch) fetch.
Hint: window.fetch = function patchedFetch( /* magic */ );
For each request log to console a span. Eg. for request fetch('https://google.com/api') the span
could be something like this.

```
{
  start: 1608205775624,
  end: 1608205785624,
  data: {
    url: 'https://google.com/api',
    method: 'GET'
    //what else interesting
    ...
    resTimings: {
      connectEnd: 10
      connectStart: 0
      responseStart: 11,
      responseEnd: 30
      ...
      etc
    }
  }
}
```

For each request try to capture and match corresponding resource timings from browser's APIs.
Resource timings have more detailed info about request check specs for more info.
Can use either resource timings (performance.getEntriesByType('resource') ) or PerformanceObserver.

https://www.w3.org/TR/resource-timing-2/
https://w3c.github.io/performance-timeline/

Matching correct resource timings to span can be tricky. Doesn't need to be perfect.
