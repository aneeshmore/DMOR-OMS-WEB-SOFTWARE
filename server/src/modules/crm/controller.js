import { CrmService } from './service.js';

export class CrmController {
  constructor() {
    this.service = new CrmService();
  }

  createVisit = async (req, res, next) => {
    try {
      if (!req.user || !req.user.employeeId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
      }
      const visit = await this.service.createVisit(req.body, req.user.employeeId);
      res.status(201).json({
        success: true,
        data: visit,
      });
    } catch (error) {
      next(error);
    }
  };

  getVisits = async (req, res, next) => {
    try {
      const visits = await this.service.getVisits(req.query, req.user);
      res.status(200).json({
        success: true,
        data: visits,
      });
    } catch (error) {
      next(error);
    }
  };

  updateVisit = async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      console.log('Update Request:', { id, body: req.body });
      const visit = await this.service.updateVisit(id, req.body);
      res.status(200).json({
        success: true,
        data: visit,
      });
    } catch (error) {
      console.error('Update Error:', error);
      next(error);
    }
  };
}
