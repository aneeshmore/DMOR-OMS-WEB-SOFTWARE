export class PMOrderDTO {
  constructor(order, customer, salesPerson, account) {
    this.orderId = order.orderId;
    this.orderNumber = order.orderNumber;
    this.customerName = customer?.companyName || 'Unknown';
    this.location = customer?.location || customer?.address || 'Unknown';
    this.salesPersonName = salesPerson
      ? `${salesPerson.firstName} ${salesPerson.lastName}`
      : 'Unknown';
    this.totalAmount = order.totalAmount;
    this.status = order.status;
    this.orderDate = order.createdAt;
    this.expectedDeliveryDate = order.expectedDeliveryDate;
    this.pmRemarks = order.pmRemarks;
    this.adminRemarks = account?.remarks || order.adminRemarks || '';
    this.billNo = account?.billNo || order.billNo || '';
    this.factoryAccepted = order.factoryAccepted;
  }
}
