import { AdminAccountsService } from './service.js';
import logger from '../../config/logger.js';
// Admin accounts controller
import { acceptOrderSchema, holdOrderSchema, rejectOrderSchema } from './schema.js';

export class AdminAccountsController {
  constructor() {
    this.service = new AdminAccountsService();
  }

  getPendingPayments = async (req, res, next) => {
    try {
      const orders = await this.service.getPendingPaymentOrders();
      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  };

  getCancelledOrders = async (req, res, next) => {
    try {
      const orders = await this.service.getCancelledOrders();
      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  };

  getOrderDetails = async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id);
      const data = await this.service.getOrderDetails(orderId);
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Accept order with accounting details
   * POST /api/admin-accounts/:id/accept
   */
  acceptOrder = async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id);
      const validatedData = acceptOrderSchema.parse(req.body);

      const order = await this.service.acceptOrder(orderId, validatedData);

      logger.info('Order accepted by accountant', { orderId });

      res.json({
        success: true,
        data: order,
        message: 'Order accepted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Hold order
   * PUT /api/admin-accounts/:id/hold
   */
  holdOrder = async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id);
      const validatedData = holdOrderSchema.parse(req.body);

      const order = await this.service.holdOrder(orderId, validatedData);

      logger.info('Order placed on hold', { orderId });

      res.json({
        success: true,
        data: order,
        message: 'Order placed on hold',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Reject order
   * PUT /api/admin-accounts/:id/reject
   */
  rejectOrder = async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id);
      const validatedData = rejectOrderSchema.parse(req.body);

      const order = await this.service.rejectOrder(orderId, validatedData);

      logger.info('Order rejected', { orderId });

      res.json({
        success: true,
        data: order,
        message: 'Order rejected',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Legacy clear payment (kept for backwards compatibility)
   * POST /api/admin-accounts/:id/clear-payment
   */
  clearPayment = async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id);
      const { billNo, remarks } = req.body;

      const order = await this.service.clearPayment(orderId, { billNo, remarks });

      logger.info('Payment cleared by Admin', { orderId });

      res.json({
        success: true,
        data: order,
        message: 'Payment cleared successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  toggleHold = async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id);
      const { remarks } = req.body;

      const order = await this.service.toggleHold(orderId, { remarks });

      logger.info('Order hold status toggled by Admin', { orderId, status: order.status });

      res.json({
        success: true,
        data: order,
        message: order.status === 'On Hold' ? 'Order put on hold' : 'Order removed from hold',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update Bill Number only
   * PUT /api/admin-accounts/:id/bill-no
   */
  updateBillNo = async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id);
      const { billNo } = req.body;

      if (!billNo) {
        throw new Error('Bill No is required');
      }

      const order = await this.service.updateBillNo(orderId, { billNo });

      logger.info('Bill No updated by Admin', { orderId, billNo });

      res.json({
        success: true,
        data: order,
        message: 'Bill Number updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Resume order (Remove from Hold)
   * PUT /api/admin-accounts/:id/resume
   */
  resumeOrder = async (req, res, next) => {
    try {
      const orderId = parseInt(req.params.id);

      const order = await this.service.resumeOrder(orderId);

      logger.info('Order resumed (removed from hold) by Admin', { orderId });

      res.json({
        success: true,
        data: order,
        message: 'Order removed from hold',
      });
    } catch (error) {
      next(error);
    }
  };
}
