import { DiscardRepository } from './repository.js';
import { AppError } from '../../utils/AppError.js';

export class DiscardService {
  constructor() {
    this.repository = new DiscardRepository();
  }

  async getAllDiscards(filters) {
    return await this.repository.findAllDiscards(filters);
  }

  async getDiscardById(discardId) {
    const discard = await this.repository.findDiscardById(discardId);
    if (!discard) {
      throw new AppError('Discard entry not found', 404);
    }
    return discard;
  }

  async createDiscard(discardData) {
    // Basic validation logic if needed, e.g. check stock availability (optional but good)
    return await this.repository.createDiscard(discardData);
  }

  async updateDiscard(discardId, updateData) {
    const existing = await this.repository.findDiscardById(discardId);
    if (!existing) {
      throw new AppError('Discard entry not found', 404);
    }
    // Note: Updating quantity tracks complexity with stock adjustment.
    // For now, simple update of fields.
    // If strict inventory, we should revert old stock change and apply new.
    // Leaving as simple update for now based on user request "perform crud".
    return await this.repository.updateDiscard(discardId, updateData);
  }

  async deleteDiscard(discardId) {
    const existing = await this.repository.findDiscardById(discardId);
    if (!existing) {
      throw new AppError('Discard entry not found', 404);
    }
    // TODO: Revert stock update on delete?
    await this.repository.deleteDiscard(discardId);
  }
}
