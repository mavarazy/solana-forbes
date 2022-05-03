import pRetry from "p-retry";

export async function throttle<T>(
  tasks: Array<() => Promise<T>>,
  durationSec: number,
  num: number,
  start = 0,
  agg: T[] = []
): Promise<T[]> {
  console.log("Processing ", start, " of ", tasks.length);

  const pending = Promise.all(
    Array(Math.min(num, tasks.length - start))
      .fill(null)
      .map((_, i) =>
        pRetry(tasks[start + i], { retries: 15, minTimeout: 10000 })
      )
  );

  const timer = new Promise((resolve) => {
    setTimeout(resolve, durationSec * 1000);
  });
  await timer;

  const completeTasks = await pending;
  if (start + num >= tasks.length) {
    return agg.concat(completeTasks);
  }

  return throttle(
    tasks,
    durationSec,
    num,
    start + num,
    agg.concat(completeTasks)
  );
}
