import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Opens the door for your Netlify URL
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Listen for new questions from the frontend and broadcast them
    socket.on("new_question", (data) => {
      io.emit("new_question", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};