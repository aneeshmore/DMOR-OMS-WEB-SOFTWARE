export class BOMDTO {
    constructor(bom) {
        this.bomId = bom.bomId || bom.bom_id;
        this.finishedGoodId = bom.finishedGoodId || bom.finished_good_id;
        this.rawMaterialId = bom.rawMaterialId || bom.raw_material_id;
        this.percentage = bom.percentage;
        this.createdAt = bom.createdAt || bom.created_at;
        this.updatedAt = bom.updatedAt || bom.updated_at;
    }
}
