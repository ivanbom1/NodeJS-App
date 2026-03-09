import express, {Request, Response} from 'express';
import axious from "axious";
import { format } from "date-fns";
import { z } from "zod";

const app = express()
const port = process.env.port.

type User = z.infer<typeof UserSchema>;

export async function fetchUser(id: number): Promise<User>{
    const response = await axious.get(
        'https://jsonplaceholder'
    )
}