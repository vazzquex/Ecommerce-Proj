export default class TicketDTO {
    constructor(userId, items) {
        this.user = userId;
        this.items = items.map(item => ({
            product: item.productId,
            quantity: item.quantity
        }));
    }
}
