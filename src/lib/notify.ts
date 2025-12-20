export class Notifier<T> {
  private resolve: ((value: T) => void) | null = null;
  private promise!: Promise<T>;

  constructor() {
    this.reset();
  }

  reset() {
    this.promise = new Promise<T>((resolve) => {
      this.resolve = resolve;
    });
  }

  notify(value: T) {
    if (this.resolve) {
      this.resolve(value);
    }
  }

  async wait(timeoutMs?: number): Promise<T> {
    if (timeoutMs === undefined) {
      return this.promise;
    }

    let timerId: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timerId = setTimeout(() => {
        reject(new Error(`Waited ${timeoutMs}ms but received no notification.`));
      }, timeoutMs);
    });

    try {
      return await Promise.race([this.promise, timeoutPromise]);
    } finally {
      if (timerId) clearTimeout(timerId);
    }
  }
}
