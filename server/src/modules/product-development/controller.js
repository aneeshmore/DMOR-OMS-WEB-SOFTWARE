import { ProductDevelopmentService } from './service.js';
import logger from '../../config/logger.js';

export class ProductDevelopmentController {
  constructor() {
    this.service = new ProductDevelopmentService();
  }

  create = async (req, res, next) => {
    try {
      const data = req.body;
      logger.info('Create Product Development Request', { data });

      const result = await this.service.createProductDevelopment({
        ...data,
        createdBy: req.user?.employeeId || 1,
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Create Product Development Error', error);
      next(error);
    }
  };

  getByMasterProductId = async (req, res, next) => {
    try {
      const { masterProductId } = req.params;
      logger.info(`Get By MasterProductID: ${masterProductId}`);

      const result = await this.service.getLatestByMasterProductId(masterProductId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Get Product Development Error', error);
      next(error);
    }
  };

  /**
   * Get mixing ratios for Base and Hardener
   * Used by auto-add Hardener feature in Create Order
   */
  getMixingRatios = async (req, res, next) => {
    try {
      const { baseMpId, hardenerMpId } = req.params;
      logger.info(`Get Mixing Ratios: Base=${baseMpId}, Hardener=${hardenerMpId}`);

      const [baseRecord, hardenerRecord] = await Promise.all([
        this.service.getLatestByMasterProductId(baseMpId),
        this.service.getLatestByMasterProductId(hardenerMpId),
      ]);

      res.json({
        success: true,
        data: {
          baseRatio: parseFloat(baseRecord?.mixingRatioPart) || 1,
          hardenerRatio: parseFloat(hardenerRecord?.mixingRatioPart) || 1,
        },
      });
    } catch (error) {
      logger.error('Get Mixing Ratios Error', error);
      next(error);
    }
  };
}
