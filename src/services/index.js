import Users from "../DAOs/users.dao.js";
import Ticket from "../DAOs/ticket.dao.js";
import Product from "../DAOs/products.dao.js";

import ProductRepository from "../repositories/products.repository.js"; 
import UserRepository from "../repositories/user.repository.js";
import TicketRepository from "../repositories/tickets.repository.js";

export const productService = new ProductRepository(new Product());
export const ticketService = new TicketRepository(new Ticket());
export const userService = new UserRepository(new Users());