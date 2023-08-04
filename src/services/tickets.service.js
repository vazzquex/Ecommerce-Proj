import ticketsModel from "../dao/models/ticket.model.js";
import TicketDTO from "./dto/TicketsDto.js";

class TicketService {
    constructor() {
        this.model = ticketsModel;
    }

    async createTicket(ticketDto) {
        const ticket = new this.model({
            user: ticketDto.user,
            items: ticketDto.items,
        });
        return await ticket.save();
    }    

    async getById(id) {
        return await this.model.findById(id);
    }


}

const ticketService = new TicketService();
export default ticketService;
