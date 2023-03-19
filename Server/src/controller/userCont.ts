import { PrismaClient } from "@prisma/client";
import { error } from "console";
const prisma = new PrismaClient();
import express, { Request, Response } from "express";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import e from "express";
import * as dotenv from "dotenv";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, firstname, lastname, password } = req.body;
    const hashedPassword = await argon2.hash(password);

    let Role = "user"; // default role is user
    if (email.toLowerCase() === "abalomari95@gmail.com") {
      Role = "admin";
    }

    const user = await prisma.user.create({
      data: {
        email,
        firstname,
        lastname,
        Role,
        password: hashedPassword,
      },
    });

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.API_SECRET as string,
      { expiresIn: "3h" }
    );

    res.json({
      token,
      id: user.id,
      role: user.Role,
      email: user.email,
      fname: user.firstname,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ msg: "Internal Server Error!" });
  }
};
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { email, firstname, lastname, password, newPassword } = req.body;
    const hashedPassword = await argon2.hash(newPassword);

    const user = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        email,
        firstname,
        lastname,
        password: newPassword ? hashedPassword : password,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
// deleted users
export const deleteUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // delete the user
    await prisma.user.delete({ where: { email } });

    res.status(200).json({ message: `User ${email} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

// retrive all emails in selectedUser table
export const getSelectedUserEmails = async (req: Request, res: Response) => {
  try {
    const selectedUsers = await prisma.selecteduser.findMany({
      include: {
        reservation: {
          include: {
            user: true,
          },
        },
      },
    });

    const userEmails = selectedUsers.map((selectedUser) => {
      return selectedUser.reservation.user.email;
    });

    res.json(userEmails);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

// Delete all users
export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    const deletedUsers = await prisma.user.deleteMany();
    res
      .status(200)
      .json({ message: `Deleted ${deletedUsers.count} selected Users` });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
