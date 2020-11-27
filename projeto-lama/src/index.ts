import express from "express";
import { AddressInfo } from "net";
import dotenv from 'dotenv';
import { userRouter } from "./routes/userRouter";
import { artistsRouter } from "./routes/artistsRouter";
import { showsRouter } from "./routes/showsRouter";

dotenv.config();

const app = express();
app.use(express.json());

app.use('/user', userRouter);
app.use('/artists', artistsRouter);
app.use('/shows', showsRouter);

const server = app.listen(process.env.PORT || 3000, () => {
        if (server) {
            const address = server.address() as AddressInfo;
            console.log(`Server is running in http://localhost:${address.port}`);
        } else {
            console.error(`Failure upon starting server.`);
        }
    });
