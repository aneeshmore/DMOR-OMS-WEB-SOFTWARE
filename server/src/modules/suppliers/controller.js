import { SuppliersService } from './service.js';
import { createSupplierSchema, updateSupplierSchema } from './schema.js';

export class SuppliersController {
  constructor() {
    this.service = new SuppliersService();
  }

  getAllSuppliers = async (req, res, next) => {
    try {
      const filters = {};
      if (req.query.isActive !== undefined) {
        filters.isActive = req.query.isActive === 'true';
      }

      const suppliers = await this.service.getAllSuppliers(filters);
      res.json({ success: true, data: suppliers });
    } catch (error) {
      next(error);
    }
  };

  getSupplierById = async (req, res, next) => {
    try {
      const supplierId = parseInt(req.params.id);
      const supplier = await this.service.getSupplierById(supplierId);
      res.json({ success: true, data: supplier });
    } catch (error) {
      next(error);
    }
  };

  createSupplier = async (req, res, next) => {
    try {
      const validatedData = createSupplierSchema.parse(req.body);
      const supplier = await this.service.createSupplier(validatedData);
      res.status(201).json({
        success: true,
        data: supplier,
        message: 'Supplier created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  updateSupplier = async (req, res, next) => {
    try {
      const supplierId = parseInt(req.params.id);
      const validatedData = updateSupplierSchema.parse(req.body);
      const supplier = await this.service.updateSupplier(supplierId, validatedData);
      res.json({
        success: true,
        data: supplier,
        message: 'Supplier updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteSupplier = async (req, res, next) => {
    try {
      const supplierId = parseInt(req.params.id);
      await this.service.deleteSupplier(supplierId);
      res.json({
        success: true,
        message: 'Supplier deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const suppliersController = new SuppliersController();
