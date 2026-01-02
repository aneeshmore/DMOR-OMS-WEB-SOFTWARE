import { DeliveryCompleteService } from './service.js';

export class DeliveryCompleteController {
  constructor() {
    this.service = new DeliveryCompleteService();
  }

  getDeliveries = async (req, res, next) => {
    try {
      const { search } = req.query;
      const data = await this.service.getDeliveryStatus({ search });
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  markDelivered = async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const result = await this.service.markOrderDelivered(orderId);
      res.json({
        success: true,
        message: 'Order marked as Delivered',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
  returnOrder = async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const result = await this.service.returnOrder(orderId);
      res.json({
        success: true,
        message: 'Order marked as Returned',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  cancelOrder = async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const result = await this.service.cancelOrder(orderId);
      res.json({
        success: true,
        message: 'Order marked as Cancelled',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
