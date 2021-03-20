import { io } from "../servers";

io.on("connection", (socket) => {
    console.log(socket.id);
});

export default io;
