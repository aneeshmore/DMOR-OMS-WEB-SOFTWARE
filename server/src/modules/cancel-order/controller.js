import { CancelOrderService } from './service.js';

export class CancelOrderController {
  constructor() {
    this.service = new CancelOrderService();
  }

  getCancellableOrders = async (req, res, next) => {
    try {
      const { search } = req.query;
      const data = await this.service.getCancellableOrders({ search });
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getCancelledOrders = async (req, res, next) => {
    try {
      const { search } = req.query;
      const data = await this.service.getCancelledOrders({ search });
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req, res, next) => {
    try {
      const data = await this.service.getStats();
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  cancelOrder = async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { reason } = req.body;

      if (!reason || !reason.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Cancellation reason is required',
        });
      }

      const result = await this.service.cancelOrder(orderId, reason);
      res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
