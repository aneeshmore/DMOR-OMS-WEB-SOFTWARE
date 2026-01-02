import { InwardService } from './service.js';
import { createInwardSchema, updateInwardSchema } from './schema.js';
import { AppError } from '../../utils/AppError.js';

export class InwardController {
  constructor() {
    this.service = new InwardService();
  }

  getAllInwards = async (req, res, next) => {
    try {
      const filters = {
        productId: req.query.productId ? parseInt(req.query.productId) : undefined,
      };
      const inwards = await this.service.getAllInwards(filters);
      res.json({
        success: true,
        data: inwards,
      });
    } catch (error) {
      next(error);
    }
  };

  getInwardById = async (req, res, next) => {
    try {
      const inward = await this.service.getInwardById(req.params.id);
      res.json({
        success: true,
        data: inward,
      });
    } catch (error) {
      next(error);
    }
  };

  createInward = async (req, res, next) => {
    try {
      const validation = createInwardSchema.safeParse(req.body);
      if (!validation.success) {
        const errorMessages = validation.error.errors
          .map(e => `${e.path.join('.')}: ${e.message}`)
          .join(', ');
        throw new AppError(`Validation Error: ${errorMessages}`, 400);
      }

      const { billNo, supplierId, notes, items } = validation.data;

      // Map bill details to each item
      const inwardData = items.map(item => ({
        ...item,
        billNo,
        supplierId,
        notes,
        inwardDate: item.inwardDate ? new Date(item.inwardDate) : new Date(),
      }));

      const inward = await this.service.createInward(inwardData);
      res.status(201).json({
        success: true,
        data: inward,
        message: 'Inward entries created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  updateInward = async (req, res, next) => {
    try {
      const validation = updateInwardSchema.safeParse(req.body);
      if (!validation.success) {
        const errorMessages = validation.error.errors
          .map(e => `${e.path.join('.')}: ${e.message}`)
          .join(', ');
        throw new AppError(`Validation Error: ${errorMessages}`, 400);
      }

      if (validation.data.inwardDate) {
        validation.data.inwardDate = new Date(validation.data.inwardDate);
      }

      const inward = await this.service.updateInward(req.params.id, validation.data);
      res.json({
        success: true,
        data: inward,
        message: 'Inward entry updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Removed getUniqueSuppliers - use /api/suppliers endpoint instead

  getBillInfo = async (req, res, next) => {
    try {
      const { billNo } = req.params;
      const { supplierId, productType, inwardDate } = req.query;

      if (!supplierId) {
        throw new AppError('Supplier ID is required', 400);
      }

      if (!productType) {
        throw new AppError('Product type is required', 400);
      }

      if (!inwardDate) {
        throw new AppError('Inward date is required', 400);
      }

      const billInfo = await this.service.getBillInfo(
        billNo,
        parseInt(supplierId),
        productType,
        inwardDate
      );
      res.json({
        success: true,
        data: billInfo,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteInward = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.service.deleteInward(id);
      res.json({
        success: true,
        message: 'Inward entry deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteBill = async (req, res, next) => {
    try {
      const { billNo, supplierId, productType, inwardDate } = req.query;

      // if (!billNo) {
      //   throw new AppError('Bill number is required', 400);
      // }

      if (!supplierId) {
        throw new AppError('Supplier ID is required', 400);
      }

      if (!productType) {
        throw new AppError('Product type is required', 400);
      }

      if (!inwardDate) {
        throw new AppError('Inward date is required', 400);
      }

      const result = await this.service.deleteBill(
        billNo,
        parseInt(supplierId),
        productType,
        inwardDate
      );

      res.json({
        success: true,
        message: `Bill deleted successfully. ${result.deletedCount} record(s) removed.`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
