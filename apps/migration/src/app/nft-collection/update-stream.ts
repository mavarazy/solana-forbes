export interface UpdateStream<T> {
  emit(value: T): void;
}
