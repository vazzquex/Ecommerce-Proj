import ticketsModel from "../DAOs/models/ticket.model.js";
import BaseRepository from "./base.repository.js";

export default class TicketRepository extends BaseRepository {
    constructor(dao) {
        super(dao);
    }

    async createTicket(ticketDto) {
        const ticketData = {
            purchaser: ticketDto.userEmail,
            amount: ticketDto.amount,
            items: ticketDto.items,
        };
        return await ticketsModel.create(ticketData);
    }


    async getById(id) {
        return await ticketsModel.getById(id);
    }
}
