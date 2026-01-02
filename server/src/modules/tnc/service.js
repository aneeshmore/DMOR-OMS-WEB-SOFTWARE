import { TncRepository } from './repository.js';

export class TncService {
  constructor() {
    this.repository = new TncRepository();
  }

  async createTnc(data) {
    return await this.repository.create(data);
  }

  async getAllTnc() {
    return await this.repository.findAll();
  }

  async updateTnc(id, data) {
    return await this.repository.update(id, data);
  }

  async deleteTnc(id) {
    return await this.repository.delete(id);
  }
}
