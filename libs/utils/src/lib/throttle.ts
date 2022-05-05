import delay from 'delay';

export async function throttle<T>(
  tasks: Array<() => Promise<T>>,
  duration: number,
  num: number,
  start = 0,
  agg: T[] = []
): Promise<T[]> {
  console.log('Processing ', start, ' of ', tasks.length);

  const pending = Promise.all(
    Array(Math.min(num, tasks.length - start))
      .fill(null)
      .map((_, i) => tasks[start + i]())
  );

  await delay(duration);

  const completeTasks = await pending;
  if (start + num >= tasks.length) {
    return agg.concat(completeTasks);
  }

  return throttle(tasks, duration, num, start + num, agg.concat(completeTasks));
}
