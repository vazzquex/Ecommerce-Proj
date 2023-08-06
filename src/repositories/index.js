import UserRepository from "./user.repository.js";
import TicketRepository from "./tickets.repository.js";

export const userRepository = new UserRepository();
export const ticketsRepository = new TicketRepository();

