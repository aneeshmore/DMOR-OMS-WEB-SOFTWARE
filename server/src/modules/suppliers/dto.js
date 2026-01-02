export class SupplierDTO {
  constructor(data) {
    this.supplierId = data.supplierId || data.supplier_id;
    this.supplierName = data.supplierName || data.supplier_name;
    this.isActive = data.isActive ?? data.is_active ?? true;
    this.createdAt = data.createdAt || data.created_at;
    this.updatedAt = data.updatedAt || data.updated_at;
  }
}
