import ticketsModel from "./models/ticket.model.js";

export default class Ticket {

    getTicketById = (id) => {
        return ticketsModel.findById(id);
    }

    deleteTicket = (id) => {
        return ticketsModel.findByIdAndDelete(id);
    }

}