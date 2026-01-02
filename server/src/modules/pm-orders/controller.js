import { PMOrdersService } from './service.js';
import logger from '../../config/logger.js';
import { approveOrderSchema } from './schema.js';

export class PMOrdersController {
  constructor() {
    this.service = new PMOrdersService();
  }

  getOrdersForApproval = async (req, res, next) => {
    try {
      const orders = await this.service.getOrdersForApproval();
      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  };

  approveOrder = async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id);
      const { expectedDeliveryDate, remarks } = approveOrderSchema.parse(req.body);

      const order = await this.service.approveOrder(orderId, { expectedDeliveryDate, remarks });

      logger.info('Order approved by PM', { orderId });

      res.json({
        success: true,
        data: order,
        message: 'Order approved for production',
      });
    } catch (error) {
      next(error);
    }
  };
}
