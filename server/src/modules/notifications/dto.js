export class NotificationDTO {
  constructor(notification) {
    this.notificationId = notification.notificationId;
    this.recipientId = notification.recipientId;
    this.type = notification.type;
    this.title = notification.title;
    this.message = notification.message;
    this.data = notification.data;
    this.priority = notification.priority;
    this.isRead = notification.isRead;
    this.isAcknowledged = notification.isAcknowledged;
    this.createdAt = notification.createdAt;
    this.updatedAt = notification.updatedAt;
  }
}
