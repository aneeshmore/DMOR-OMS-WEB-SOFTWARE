export class DispatchOrderDTO {
  constructor(order, customer, items = []) {
    const validItems = Array.isArray(items) ? items : [];

    const o = order || {};
    const c = customer || {};

    this.orderId = o.orderId;
    this.orderNumber = o.orderNumber;
    this.companyName = c.companyName || 'Unknown';
    this.location = c.location || c.address || 'Unknown';

    // Expose all items safely, including packageCapacityKg for weight calculation
    this.items = validItems.map(item => ({
      productName: item?.productName || 'Unknown',
      quantity: parseFloat(item?.quantity) || 0,
      availableQty: parseFloat(item?.availableQty) || 0,
      packageCapacityKg: parseFloat(item?.packageCapacityKg) || 0, // Weight per unit in kg
    }));

    // Aggregate Product Names
    this.productName =
      this.items.length > 0 ? this.items.map(i => i.productName).join(', ') : 'No Items';

    // Total Quantity
    this.qty = this.items.reduce((sum, i) => sum + i.quantity, 0);
    this.availableQty = this.items.reduce((sum, i) => sum + i.availableQty, 0);

    this.dispatchDate = new Date().toISOString();
    this.orderDate = o.orderDate;

    this.billNo = o.billNo || o.orderNumber || 'Pending';

    // Weight calculation: sum of (packageCapacityKg * quantity) for each item, converted to tons
    // Formula: weight per unit (kg) × quantity = total kg, then / 1000 = tons
    this.weightInTons = this.items.reduce((total, item) => {
      const itemWeightKg = item.packageCapacityKg * item.quantity;
      return total + itemWeightKg / 1000; // Convert kg to tons
    }, 0);
  }
}
