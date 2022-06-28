import delay from 'delay';

export async function throttle<T>(
  tasks: Array<() => Promise<T>>,
  duration: number,
  num: number,
  start = 0,
  agg: T[] = []
): Promise<T[]> {
  console.log('Processing ', start, ' of ', tasks.length);

  const pending: Array<T | null> = await Promise.all(
    Array(Math.min(num, tasks.length - start))
      .fill(null)
      .map((_, i) => {
        try {
          return tasks[start + i]();
        } catch (err) {
          console.log('Task ', start + i, ' failed');
          return null;
        }
      })
  );

  await delay(duration);

  const completeTasks: T[] = pending.filter((res): res is T => res !== null);
  if (start + num >= tasks.length) {
    console.log('Throttle done');
    return agg.concat(completeTasks);
  }

  return throttle(tasks, duration, num, start + num, agg.concat(completeTasks));
}
