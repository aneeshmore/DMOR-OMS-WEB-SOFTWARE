import { DeliveryCompleteRepository } from './repository.js';

export class DeliveryCompleteService {
  constructor() {
    this.repository = new DeliveryCompleteRepository();
  }

  async getDeliveryStatus(query) {
    return await this.repository.findAll(query);
  }

  async markOrderDelivered(orderId) {
    return await this.repository.markAsDelivered(orderId);
  }

  async returnOrder(orderId) {
    return await this.repository.markAsReturned(orderId);
  }

  async cancelOrder(orderId) {
    return await this.repository.markAsCancelled(orderId);
  }
}
