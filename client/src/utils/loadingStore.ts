type Listener = (count: number) => void;

/**
 * A lightweight, framework-agnostic store to track active API requests.
 * Thinking like a professional SE: We use a counter instead of a boolean
 * to handle multiple concurrent requests accurately.
 */
class LoadingStore {
  private count = 0;
  private listeners: Set<Listener> = new Set();

  /**
   * Increment active request count
   */
  inc() {
    this.count++;
    this.notify();
  }

  /**
   * Decrement active request count
   */
  dec() {
    this.count = Math.max(0, this.count - 1);
    this.notify();
  }

  /**
   * Get current number of active requests
   */
  getCount() {
    return this.count;
  }

  /**
   * Subscribe to changes in the active request count
   */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    // Initial call
    listener(this.count);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.count));
  }
}

export const loadingStore = new LoadingStore();
