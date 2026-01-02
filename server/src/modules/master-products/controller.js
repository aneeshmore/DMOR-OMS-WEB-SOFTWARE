import { MasterProductsService } from './service.js';
import {
  createMasterProductSchema,
  updateMasterProductSchema,
  createProductSchema,
  updateProductSchema,
} from './schema.js';
import logger from '../../config/logger.js';
import { calculateRMCostFromBOM, recalculateAllRMCosts } from './calculations.js';

export class MasterProductsController {
  constructor() {
    this.service = new MasterProductsService();
  }

  // Master Product endpoints
  getAllMasterProducts = async (req, res, next) => {
    try {
      const filters = {};
      if (req.query.type) {
        filters.productType = req.query.type;
      }
      const masterProducts = await this.service.getAllMasterProducts(filters);
      res.json({ success: true, data: masterProducts });
    } catch (error) {
      next(error);
    }
  };

  getMasterProductById = async (req, res, next) => {
    try {
      const masterProductId = parseInt(req.params.id);
      const masterProduct = await this.service.getMasterProductById(masterProductId);
      res.json({ success: true, data: masterProduct });
    } catch (error) {
      next(error);
    }
  };

  createMasterProduct = async (req, res, next) => {
    try {
      const validatedData = createMasterProductSchema.parse(req.body);
      const masterProduct = await this.service.createMasterProduct(validatedData);
      res.status(201).json({
        success: true,
        data: masterProduct,
        message: 'Master product created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  updateMasterProduct = async (req, res, next) => {
    try {
      const masterProductId = parseInt(req.params.id);
      const validatedData = updateMasterProductSchema.parse(req.body);
      const masterProduct = await this.service.updateMasterProduct(masterProductId, validatedData);
      res.json({
        success: true,
        data: masterProduct,
        message: 'Master product updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteMasterProduct = async (req, res, next) => {
    try {
      const masterProductId = parseInt(req.params.id);
      await this.service.deleteMasterProduct(masterProductId);
      res.json({
        success: true,
        message: 'Master product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Product endpoints
  getAllProducts = async (req, res, next) => {
    try {
      const filters = {};
      if (req.query.type) {
        filters.productType = req.query.type;
      }
      if (req.query.MasterProductID) {
        filters.masterProductId = parseInt(req.query.MasterProductID);
      }

      const products = await this.service.getAllProducts(filters);
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await this.service.getProductById(productId);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  getProductsByType = async (req, res, next) => {
    try {
      const productType = req.params.type.toUpperCase();
      const products = await this.service.getProductsByType(productType);
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  };

  getLowStockProducts = async (req, res, next) => {
    try {
      const products = await this.service.getLowStockProducts();
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req, res, next) => {
    try {
      const validatedData = createProductSchema.parse(req.body);
      const product = await this.service.createProduct(validatedData);
      res.status(201).json({
        success: true,
        data: product,
        message: 'Product created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const validatedData = updateProductSchema.parse(req.body);
      const product = await this.service.updateProduct(productId, validatedData);
      res.json({
        success: true,
        data: product,
        message: 'Product updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      await this.service.deleteProduct(productId);
      res.json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Calculation endpoints
  calculateRMCost = async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const calculation = await calculateRMCostFromBOM(productId);
      res.json({
        success: true,
        data: calculation,
        message: 'RM cost calculated successfully',
      });
    } catch (error) {
      logger.error('Error calculating RM cost:', error);
      next(error);
    }
  };

  recalculateAllCosts = async (req, res, next) => {
    try {
      const results = await recalculateAllRMCosts();
      res.json({
        success: true,
        data: results,
        message: `Recalculated RM costs for ${results.length} products`,
      });
    } catch (error) {
      logger.error('Error recalculating all RM costs:', error);
      next(error);
    }
  };
}

export const masterProductsController = new MasterProductsController();
