import { CancelOrderRepository } from './repository.js';

export class CancelOrderService {
  constructor() {
    this.repository = new CancelOrderRepository();
  }

  async getCancellableOrders(query) {
    return await this.repository.findCancellableOrders(query);
  }

  async getCancelledOrders(query) {
    return await this.repository.findCancelledOrders(query);
  }

  async getStats() {
    return await this.repository.getStats();
  }

  async cancelOrder(orderId, reason) {
    return await this.repository.cancelOrder(orderId, reason);
  }
}
