/**
 * Account DTOs
 */

export const AccountDTO = account => ({
  accountId: account.accountId,
  accountUuid: account.accountUuid,
  orderId: account.orderId,
  billNo: account.billNo,
  billDate: account.billDate,
  billAmount: account.billAmount ? parseFloat(account.billAmount) : null,
  paymentStatus: account.paymentStatus,
  paymentCleared: account.paymentCleared,
  paymentDate: account.paymentDate,
  paymentMethod: account.paymentMethod,
  paymentReference: account.paymentReference,
  accountantId: account.accountantId,
  processedDate: account.processedDate,
  remarks: account.remarks,
  taxAmount: account.taxAmount ? parseFloat(account.taxAmount) : 0,
  taxPercentage: account.taxPercentage ? parseFloat(account.taxPercentage) : 0,
  createdAt: account.createdAt,
  updatedAt: account.updatedAt,
});
export const AccountWithOrderDTO = account => ({
  ...AccountDTO(account),
  order: account.order
    ? {
        orderNumber: account.order.orderNumber,
        customerId: account.order.customerId,
        salespersonId: account.order.salespersonId,
        totalAmount: account.order.totalAmount ? parseFloat(account.order.totalAmount) : 0,
        status: account.order.status,
        priorityLevel: account.order.priorityLevel,
      }
    : null,
  accountant: account.accountant
    ? {
        employeeId: account.accountant.employeeId,
        firstName: account.accountant.firstName,
        lastName: account.accountant.lastName,
        email: account.accountant.email,
      }
    : null,
});
