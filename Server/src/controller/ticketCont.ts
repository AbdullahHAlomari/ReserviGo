import { Prisma, PrismaClient } from "@prisma/client";
import { error } from "console";
const prisma = new PrismaClient();
import express, { Request, Response } from "express";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import e from "express";
import * as dotenv from "dotenv";
import nodemailer from "nodemailer";
// import sgMail, { MailDataRequired } from '@sendgrid/mail'
dotenv.config();
// sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const response = await prisma.ticket.findMany();
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ msg: "Internal Server Error!" });
  }
};
export const getTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
    });
    res.status(200).json(ticket);
  } catch (e) {
    res.status(500).json({ msg: "Internal Server Error!" });
  }
};
///////////////////
// best version of create function
export const createTicket = async (req: Request, res: Response) => {
  try {
    // Create ticket
    const {
      event,
      availableQty,
      location,
      description,
      image,
      price,
      endDate,
    } = req.body;
    const ticket = await prisma.ticket.create({
      data: {
        image,
        event,
        availableQty: Number(availableQty),
        location,
        description,
        price: parseFloat(price),
        endDate,
      },
    });

    setTimeout(async () => {
      try {
        // Get all reservations for ticket
        const reservations = await prisma.reservation.findMany({
          where: {
            ticketId: ticket.id,
          },
          include: {
            user: true,
          },
        });

        // Select user random equal to ticket
        const selectedUsers = [];
        const totalReservations = reservations.length;
        const usedIndices = new Set();
        for (let i = 0; i < availableQty && i < totalReservations; i++) {
          let randomIndex = Math.floor(Math.random() * totalReservations);
          while (usedIndices.has(randomIndex)) {
            randomIndex = Math.floor(Math.random() * totalReservations);
          }
          usedIndices.add(randomIndex);
          selectedUsers.push({
            id: `${ticket.id}_${reservations[randomIndex].userId}`,
            reservationId: reservations[randomIndex].id,
            userId: reservations[randomIndex].userId,
            ticketId: reservations[randomIndex].ticketId,
            expirationTime: new Date(Date.now() + 2 * 60 * 1000), // 3 minutes in milliseconds
          });
        }

        // Add selected users to selecteduser database
        await prisma.selecteduser.createMany({
          data: selectedUsers,
        });

        // Send email to each selected user
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PWD,
          },
        });

        for (const selectedUser of selectedUsers) {
          const user = await prisma.user.findUnique({
            where: { id: selectedUser.userId },
          });
          if (!user) {
            console.error(`User with id ${selectedUser.userId} not found`);
            continue;
          }
          const email = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "You've been selected for a ticket!",
            text: `Congratulations! You have been selected to purchase a ticket for ${ticket.event} and your reservation number is: ${ticket.id}. Please follow this link to purchase the ticket before it expires in 30 minutes:   http://example.com/purchaseTicket/${selectedUser.id}`,
          };

          transporter.sendMail(email, (error, info) => {
            if (error) {
              console.error(error);
            } else {
              console.log(`Email sent to ${user.email}: ${info.response}`);
            }
          });
        }

        // Check if any selected user is not purchased the ticket after 3 minutes
        setTimeout(async () => {
          try {
            const expiredSelectedUsers = await prisma.selecteduser.findMany({
              where: {
                ticketId: ticket.id,
                isPurchased: false,
                expirationTime: {
                  lte: new Date(),
                },
              },
            });

            for (const selectedUser of expiredSelectedUsers) {
              // Remove the expired selected user
              await prisma.selecteduser.delete({
                where: {
                  id: selectedUser.id,
                },
              });

              // Find another user to replace the expired selected user
              const availableReservations = await prisma.reservation.findMany({
                where: {
                  ticketId: ticket.id,
                  AND: [
                    {
                      id: {
                        not: selectedUser.reservationId,
                      },
                    },
                    {
                      selecteduser: {
                        none: {
                          id: selectedUser.id,
                        },
                      },
                    },
                  ],
                },
                take: 1,
              });

              if (availableReservations.length > 0) {
                // Add the new selected user
                const newSelectedUser = {
                  id: `${ticket.id}_${availableReservations[0].userId}`,
                  reservationId: availableReservations[0].id,
                  userId: availableReservations[0].userId,
                  ticketId: availableReservations[0].ticketId,
                  expirationTime: new Date(Date.now() + 2 * 60 * 1000), // 3 minutes in milliseconds
                };

                await prisma.selecteduser.create({
                  data: newSelectedUser,
                });
                // Send email to the new selected user
                const user = await prisma.user.findUnique({
                  where: { id: availableReservations[0].userId },
                });
                if (!user) {
                  console.error(
                    `User with id ${availableReservations[0].userId} not found`
                  );
                  return;
                }
                const email = {
                  from: process.env.EMAIL_FROM,
                  to: user.email,
                  subject: "You've been selected for a ticket!",
                  text: `Congratulations! You have been selected to purchase a ticket for ${ticket.event}. Please follow this link to purchase the ticket before it expires: http://example.com/purchase/${newSelectedUser.id}`,
                };

                transporter.sendMail(email, (error, info) => {
                  if (error) {
                    console.error(error);
                  } else {
                    console.log(
                      `Email sent to ${user.email}: ${info.response}`
                    );
                  }
                });
              }
            }
          } catch (error) {
            console.error(error);
          }
        }, 2* 60 * 1000); // 2 minutes
      } catch (error) {
        console.error(error);
      }
    }, 2 * 60 * 1000); // 2 minutes

    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

//////////////

// export const createTicket = async (req: Request, res: Response) => {
//   try {
//     const { event, availableQty } = req.body;
//     const ticket = await prisma.ticket.create({
//       data: {
//         event,
//         availableQty,
//       },
//     });

//     setTimeout(async () => {
//       // Get all reservations for this ticket
//       const reservations = await prisma.reservation.findMany({
//         where: {
//           ticketId: ticket.id,
//         },
//         include: {
//           user: true,
//         },
//       });

//       // Randomly select users equal to availableQty
//       const selectedUsers = [];
//       const totalReservations = reservations.length;
//       const usedIndices = new Set();
//       for (let i = 0; i < availableQty && i < totalReservations; i++) {
//         let randomIndex = Math.floor(Math.random() * totalReservations);
//         while (usedIndices.has(randomIndex)) {
//           randomIndex = Math.floor(Math.random() * totalReservations);
//         }
//         usedIndices.add(randomIndex);
//         selectedUsers.push({
//           id: `${ticket.id}_${reservations[randomIndex].userId}`, // Add ID based on ticket ID and user ID
//           reservationId: reservations[randomIndex].id,
//           userId: reservations[randomIndex].userId,
//           ticketId: reservations[randomIndex].ticketId,
//           expirationTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes in milliseconds
//         });
//       }

//       // Add selected users to selecteduser database
//       await prisma.selecteduser.createMany({
//         data: selectedUsers,
//       });
//     }, 5 * 60 * 1000); // 5 minutes in milliseconds

//     res.status(201).json(ticket);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal server error');
//   }
// };

export const getAllReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        ticket: true,
        user: true,
        selecteduser: true,
      },
    });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error!" });
  }
};
export const getUserReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: req.params.id },
      include: {
        ticket: true,
        user: true,
        selecteduser: true,
      },
    });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error!" });
  }
};

export const createReservation = async (req: Request, res: Response) => {
  try {
    const { ticketId, email, firstName, lastName } = req.body;

    // check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if the user has already reserved the ticket for any event using this ticket
    const reservations = await prisma.reservation.findMany({
      where: {
        userId: user.id,
        ticket: {
          id: ticketId,
        },
      },
    });

    if (reservations.length > 0) {
      return res
        .status(400)
        .json({ message: "User has already reserved this ticket" });
    }

    // create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        user: { connect: { email } },
        ticket: { connect: { id: ticketId } },
      },
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

export const deleteReservation = async (req: Request, res: Response) => {
  console.log(req.params.id);
  try {
    const reservation = await prisma.reservation.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

export const deleteReservationByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.body;

    const deletedReservations = await prisma.reservation.deleteMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      message: `Deleted ${deletedReservations.count} reservations for user ${userId}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

// Delete all reservations
export const deleteAllReservations = async (req: Request, res: Response) => {
  try {
    const deletedReservations = await prisma.reservation.deleteMany();

    res
      .status(200)
      .json({ message: `Deleted ${deletedReservations.count} reservations` });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

// delete all selected user
export const deleteAllSelectedUsers = async (req: Request, res: Response) => {
  try {
    const deletedSelectedUsers = await prisma.selecteduser.deleteMany();
    res.status(200).json({
      message: `Deleted ${deletedSelectedUsers.count} selected users`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

// Delete all tickets
export const deleteAllTickets = async (req: Request, res: Response) => {
  try {
    const deletedTickets = await prisma.ticket.deleteMany();
    res
      .status(200)
      .json({ message: `Deleted ${deletedTickets.count} selected tickets` });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};



// Delete ticket by id
export const deleteTicketById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.$executeRaw`DELETE FROM selecteduser WHERE ticketId = ${id}`;
    await prisma.$executeRaw`DELETE FROM reservation WHERE ticketId = ${id}`;
    const deletedTicket = await prisma.ticket.delete({
      where: { id },
    });
    res.status(200).json({ message: `Deleted ticket with id ${deletedTicket.id}` });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};


// If ticket is purchased
// purchased ticket approved
export const purchaseTicket = async (req: Request, res: Response) => {
  try {
    const { selectedUserId } = req.body;

    // Find the selecteduser by ID
    const selecteduser = await prisma.selecteduser.findUnique({
      where: { id: selectedUserId },
    });

    // If the selecteduser doesn't exist, return a 404 error
    if (!selecteduser) {
      return res.status(404).json({ message: "Selecteduser not found" });
    }

    // Update the isPurchased field to true
    const updatedSelecteduser = await prisma.selecteduser.update({
      where: { id: selectedUserId },
      data: { isPurchased: true },
    });

    res.status(200).json(updatedSelecteduser);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};



