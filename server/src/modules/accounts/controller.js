import accountService from './service.js';
import { createAccountSchema, updateAccountSchema, updatePaymentSchema } from './schema.js';
import logger from '../../config/logger.js';

/**
 * Account Controllers
 */

export const getAccounts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const filters = {};
    if (req.query.paymentStatus) filters.paymentStatus = req.query.paymentStatus;
    if (req.query.deliveryStatus) filters.deliveryStatus = req.query.deliveryStatus;
    if (req.query.paymentCleared !== undefined)
      filters.paymentCleared = req.query.paymentCleared === 'true';
    if (req.query.accountantId) filters.accountantId = parseInt(req.query.accountantId);
    if (req.query.fromDate) filters.fromDate = req.query.fromDate;
    if (req.query.toDate) filters.toDate = req.query.toDate;

    const accounts = await accountService.getAll(limit, offset, filters);

    res.json({
      success: true,
      data: accounts,
      pagination: {
        limit,
        offset,
        total: accounts.length,
      },
    });
  } catch (error) {
    logger.error('Error fetching accounts:', error);
    next(error);
  }
};

export const getAccountById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await accountService.getById(parseInt(id));

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found',
      });
    }

    res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    logger.error('Error fetching account:', error);
    next(error);
  }
};

export const getAccountByOrderId = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const account = await accountService.getByOrderId(parseInt(orderId));

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found for this order',
      });
    }

    res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    logger.error('Error fetching account by order:', error);
    next(error);
  }
};

export const createAccount = async (req, res, next) => {
  try {
    const validatedData = createAccountSchema.parse(req.body);
    const account = await accountService.create(validatedData);

    res.status(201).json({
      success: true,
      data: account,
      message: 'Account created successfully',
    });
  } catch (error) {
    logger.error('Error creating account:', error);
    next(error);
  }
};

export const updateAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = updateAccountSchema.parse(req.body);

    const account = await accountService.update(parseInt(id), validatedData);

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found',
      });
    }

    res.json({
      success: true,
      data: account,
      message: 'Account updated successfully',
    });
  } catch (error) {
    logger.error('Error updating account:', error);
    next(error);
  }
};

export const updatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedData = updatePaymentSchema.parse(req.body);

    const account = await accountService.updatePayment(parseInt(id), validatedData);

    if (!account) {
      return res.status(404).json({
        success: false,
        error: 'Account not found',
      });
    }

    res.json({
      success: true,
      data: account,
      message: 'Payment updated successfully',
    });
  } catch (error) {
    logger.error('Error updating payment:', error);
    next(error);
  }
};

// Note: Delivery information is managed in the orders table, not accounts
// Use the orders API endpoints to update delivery information

export const updateDelivery = async (req, res, next) => {
  // Redirect to orders API for delivery updates
  res.status(400).json({
    success: false,
    error: 'Delivery information is managed through orders API',
    message: 'Please use PUT /api/orders/:id to update delivery information',
  });
};

export const deleteAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await accountService.deleteAccount(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Account not found',
      });
    }

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting account:', error);
    next(error);
  }
};

export const getPaymentSummary = async (req, res, next) => {
  try {
    const summary = await accountService.getPaymentSummary();

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    logger.error('Error fetching payment summary:', error);
    next(error);
  }
};
