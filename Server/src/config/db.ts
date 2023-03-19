import { v4 as uuidv4 } from 'uuid';
export const createUUID = () => uuidv4();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
    log: ["query"],
    errorFormat: "minimal",
});


const connectDB = ()=>{
    try {
        prisma.$connect()
        console.log("Databse Connected!");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB