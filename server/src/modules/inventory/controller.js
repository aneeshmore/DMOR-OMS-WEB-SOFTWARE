import { InventoryService } from './service.js';
import { createProductSchema, updateProductSchema } from './schema.js';
import logger from '../../config/logger.js';

export class InventoryController {
    constructor() {
        this.service = new InventoryService();
    }

    getAllProducts = async (req, res, next) => {
        try {
            const filters = {
                productType: req.query.productType,
                isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
            };

            const products = await this.service.getAllProducts(filters);

            res.json({
                success: true,
                data: products,
            });
        } catch (error) {
            next(error);
        }
    };

    getProductById = async (req, res, next) => {
        try {
            const productId = parseInt(req.params.id);
            const product = await this.service.getProductById(productId);

            res.json({
                success: true,
                data: product,
            });
        } catch (error) {
            next(error);
        }
    };

    createProduct = async (req, res, next) => {
        try {
            const validatedData = createProductSchema.parse(req.body);
            const product = await this.service.createProduct(validatedData);

            logger.info('Product created', { productId: product.productId });

            res.status(201).json({
                success: true,
                data: product,
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

            logger.info('Product updated', { productId });

            res.json({
                success: true,
                data: product,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteProduct = async (req, res, next) => {
        try {
            const productId = parseInt(req.params.id);
            await this.service.deleteProduct(productId);

            logger.info('Product deleted', { productId });

            res.json({
                success: true,
                message: 'Product deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    };

    getStockLedger = async (req, res, next) => {
        try {
            const productId = parseInt(req.params.id);
            const limit = parseInt(req.query.limit) || 100;

            const ledger = await this.service.getStockLedger(productId, limit);

            res.json({
                success: true,
                data: ledger,
            });
        } catch (error) {
            next(error);
        }
    };

    getLowStockProducts = async (req, res, next) => {
        try {
            const products = await this.service.getLowStockProducts();

            res.json({
                success: true,
                data: products,
            });
        } catch (error) {
            next(error);
        }
    };
}
