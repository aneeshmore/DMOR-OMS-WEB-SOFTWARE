import { PMOrdersRepository } from './repository.js';
import { AppError } from '../../utils/AppError.js';
import { PMOrderDTO } from './dto.js';

export class PMOrdersService {
  constructor() {
    this.repository = new PMOrdersRepository();
  }

  async getOrdersForApproval() {
    const results = await this.repository.findApprovalQueue();
    return results.map(
      row => new PMOrderDTO(row.orders, row.customers, row.employees, row.accounts)
    );
  }

  async approveOrder(orderId, { expectedDeliveryDate, remarks }) {
    const existing = await this.repository.findById(orderId);
    if (!existing) {
      throw new AppError('Order not found', 404);
    }

    if (existing.orders.status !== 'Accepted') {
      throw new AppError(
        'Order must be in Accepted state to be approved by Production Manager',
        400
      );
    }

    const updateData = {
      status: 'Scheduled for Production', // Production Manager approves and schedules
      factoryAccepted: true,
      // PostgreSQL DATE column expects YYYY-MM-DD string format
      expectedDeliveryDate: expectedDeliveryDate
        ? new Date(expectedDeliveryDate).toISOString().split('T')[0]
        : null,
      pmRemarks: remarks,
    };

    const updated = await this.repository.update(orderId, updateData);

    const fullData = await this.repository.findById(orderId);
    return new PMOrderDTO(
      fullData.orders,
      fullData.customers,
      fullData.employees,
      fullData.accounts
    );
  }
}
