import "reflect-metadata";
import * as dotenv from "dotenv";
import express from "express";
import {Request, Response} from "express";
import {createConnection, Connection} from "typeorm";
import {Routes} from "./routes";
import { errorHandler } from "./error/Handler/Error";
import { notFoundHandler } from "./error/Handler/NotFound";

dotenv.config();

const PORT: number = parseInt(process.env.PORT as string, 10);
if (!process.env.PORT) {
    process.exit(1);
}


// create typeorm connection
const init = createConnection().then(async (connection) => {

    const app = express();

    module.exports = app;
    app.use(express.json());

    Routes.forEach(route => {
        const action = (request: Request, response: Response, next: Function) => {
            route.action(request, response)
                .then(() => next)
                .catch((error: any) => next(error));
        };      
        if (route.method === 'get') {
            app.get(route.path, action);
        } else if (route.method === 'post') {
            app.post(route.path, action);
        } else if (route.method === 'put') {
            app.put(route.path, action);
        } else if (route.method === 'delete') {
            app.delete(route.path, action);
        }
    });
    
    app.use(errorHandler);
    app.use(notFoundHandler);

    const server = app.listen(process.env.PORT);
    
    console.log("Books API application is running on port " + process.env.PORT);

    return {app, server};

}).catch(error => console.log("Cannot run application: ", error));;

export default init;