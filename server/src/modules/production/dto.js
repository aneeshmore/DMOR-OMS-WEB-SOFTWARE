export class ProductionBatchDTO {
    constructor(batch) {
        this.batchId = batch.batchId || batch.batch_id;
        this.productId = batch.productId || batch.product_id;
        this.plannedProductionQty = batch.plannedProductionQty || batch.planned_production_qty;
        this.actualProductionQty = batch.actualProductionQty || batch.actual_production_qty;
        this.status = batch.status;
        this.supervisorId = batch.supervisorId || batch.supervisor_id;
        this.startDate = batch.startDate || batch.start_date;
        this.endDate = batch.endDate || batch.end_date;
        this.remarks = batch.remarks;
        this.createdAt = batch.createdAt || batch.created_at;
        this.updatedAt = batch.updatedAt || batch.updated_at;
    }
}
