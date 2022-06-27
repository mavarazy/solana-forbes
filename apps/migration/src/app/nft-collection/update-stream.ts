export interface UpdateStream<T> {
  update(value: T): Promise<T>;
}
