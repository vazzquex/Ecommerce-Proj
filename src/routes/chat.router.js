import { Router } from "express";
import messagesController from "../controllers/message.controller.js";
import userService from "../services/user.service.js";

const router = Router();

const chatMessagesRouter = (socketServer) => {
  socketServer.on('connection', async (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Bring chat history on connection
    try{
      const history = await messagesController.getMessages();
      // Send history
      socketServer.emit('history', history);
    } catch (error) {
      console.error(`Error al conseguir mensajes: ${error}`);
    };

    // Send message
    socket.on('message', async (msg) => {
        try{
          const newMessage = await messagesController.addMessage(msg);
          // Send last message
          socketServer.emit('currentMessage', newMessage);
        } catch (error) {
          console.error(`Error al conseguir mensajes: ${error}`);
        };
    });
  });

  router.get("/", async (req, res) => {
    const user = req.user;

    res.status(200).render('chat', {
      script: 'chat',
      style: 'chat',
      title: 'coder chat',
      user
    });
  });

  return router
};

export default chatMessagesRouter;