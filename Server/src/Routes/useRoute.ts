import validate from "../middleware/validate";
import express, { Router } from "express";
import { auth } from "./../middleware/auth";
let router = express.Router();
import { z } from "zod";
import {
  createReservation,
  createTicket,
  deleteAllReservations,
  deleteAllSelectedUsers,
  deleteAllTickets,
  deleteReservation,
  deleteReservationByUserId,
  deleteTicketById,
  getAllReservations,
  getAllTickets,
  getTicket,
  getUserReservations,
  purchaseTicket,
} from "../controller/ticketCont";
import {
  deleteAllUsers,
  deleteUserByEmail,
  getSelectedUserEmails,
  getUser,
  login,
  signup,
  updateUser,
} from "../controller/userCont";
import { LoginTypes, RegisterTypes } from "../zod/zodSchema";

// Ticket section
router.get("/tickets", getAllTickets);
router.get("/ticket/:id", getTicket);
router.post("/ticket", createTicket);
router.get("/getAllReservations", getAllReservations);
router.get("/getUserReservations/:id", getUserReservations);
router.post("/reserve", createReservation);
router.delete("/deletereservation/:id", deleteReservation);
router.delete("/deletereserve", deleteReservationByUserId);
router.delete("/deleteallreservation", deleteAllReservations);
router.delete("/deleteAllSelectedUsers", deleteAllSelectedUsers);
router.delete("/deleteAllTickets", deleteAllTickets);
router.delete('/deleteTicketById/:id', deleteTicketById)
router.put('/purchaseTicket', purchaseTicket)

// User Section
router.get("/user/:id", getUser);
router.post("/signup", validate(RegisterTypes), signup);
router.post("/login", validate(LoginTypes), login);
router.put("/updateUser", updateUser);
router.delete("/deleteuser", deleteUserByEmail);
router.get("/getemails", getSelectedUserEmails);
router.delete("/deleteAllUsers", deleteAllUsers);

export default router;
