export class ProductStockDTO {
    constructor(data) {
        this.ProductID = data.ProductID;
        this.MasterProductName = data.MasterProductName;
        this.ProductName = data.ProductName;
        this.OrderQty = parseFloat(data.OrderQty) || 0;
        this.AvailableQty = parseFloat(data.AvailableQty) || 0;
        this.ProductionQty = parseFloat(data.ProductionQty) || 0;
        this.TotalCommitted = this.OrderQty + this.ProductionQty;
        this.StockStatus = this.calculateStockStatus();
    }

    calculateStockStatus() {
        if (this.AvailableQty < this.TotalCommitted) {
            return 'Critical';
        } else if (this.AvailableQty < this.TotalCommitted * 1.5) {
            return 'Low';
        } else {
            return 'Healthy';
        }
    }
}

export class OrderPaymentDTO {
    constructor(data) {
        this.OrderID = data.OrderID;
        this.CompanyName = data.CompanyName;
        this.Location = data.Location;
        this.SalesPerson = data.SalesPerson;
        this.OrderCreatedDate = new Date(data.OrderCreatedDate).toLocaleDateString();
        this.BillNo = data.BillNo;
        this.PaymentCleared = data.PaymentCleared;
        this.TotalAmount = parseFloat(data.TotalAmount) || 0;
        this.DaysAgo = parseInt(data.DaysAgo) || 0;
        this.TimeSpan = this.formatTimeSpan();
    }

    formatTimeSpan() {
        if (this.DaysAgo === 0) return 'Today';
        if (this.DaysAgo === 1) return '1 day ago';
        if (this.DaysAgo < 7) return `${this.DaysAgo} days ago`;
        if (this.DaysAgo < 30) {
            const weeks = Math.floor(this.DaysAgo / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        }
        const months = Math.floor(this.DaysAgo / 30);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    }
}

export class ProductionStatusDTO {
    constructor(data) {
        this.BatchID = data.BatchID;
        this.ProductionDate = new Date(data.ProductionDate).toLocaleDateString();
        this.Supervisor = data.Supervisor;
        this.Product = data.Product;
        this.Labour = parseFloat(data.Labour) || 0;
        this.TimeRequired = parseInt(data.TimeRequired) || 0;
        this.STD_Qty = parseFloat(data.STD_Qty) || 0;
        this.Production_Qty = parseFloat(data.Production_Qty) || 0;
        this.Actual_Density = parseFloat(data.Actual_Density) || 0;
        this.Diff = parseFloat(data.Diff) || 0;
        this.Status = data.Status;
        this.Efficiency = this.calculateEfficiency();
    }

    calculateEfficiency() {
        if (this.STD_Qty === 0) return 0;
        return Math.round((this.Production_Qty / this.STD_Qty) * 100);
    }
}
