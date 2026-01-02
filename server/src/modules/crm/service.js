import { CrmRepository } from './repository.js';

export class CrmService {
  constructor() {
    this.repository = new CrmRepository();
  }

  async createVisit(data, userId) {
    const visitData = {
      ...data,
      salesExecutiveId: userId,
      visitDate: data.visitDate ? new Date(data.visitDate) : new Date(),
      nextVisitDate: data.nextVisitDate ? new Date(data.nextVisitDate) : null,
    };
    return await this.repository.createVisit(visitData);
  }

  async getVisits(filters, userContext) {
    return await this.repository.getVisits(filters, userContext);
  }

  async updateVisit(visitId, data) {
    return await this.repository.updateVisit(visitId, data);
  }
}
