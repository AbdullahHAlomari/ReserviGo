import { TypeOf, z } from "zod";

export const RegisterTypes = z.object({
  body: z.object({
    email: z.string({
      required_error: "Wrong email",
      invalid_type_error: "Invalid type error"
    }).email("Invalid email format"),
    firstname: z.string({
      required_error: "Wrong firstname",
      invalid_type_error: "Invalid type error"
    }),
    lastname: z.string({
      required_error: "Wrong lastname",
      invalid_type_error: "Invalid type error"
    }),
    password: z.string({
      required_error: "Wrong password",
      invalid_type_error: "Invalid type error"
    }).min(6, "Your password should be more than 6 char ").max(80, "Maximum password char is 80").refine(value => {
      // check for weak passwords
      const weakPasswords = ["12345", "password", "qwerty", "123456789"];
      if (weakPasswords.includes(value)) {
        throw new Error("Password is too weak");
      }
      return true;
    }),
  }),
})

  
  export const LoginTypes = z.object({
    body: z.object({
      email: z.string({
        required_error: "Wrong email",
        invalid_type_error: "Invalid type error"
      }).email("Invalid email format"),
      password: z.string({
        required_error: "Wrong password",
        invalid_type_error: "Invalid type error"
      }).min(6, "Your password should be more than 6 char ").max(80, "Maximum password char is 80"),
    }),
  })


  export type RegisterTypesSchema = TypeOf<typeof RegisterTypes>["body"]
  export type LoginTypesSchema = TypeOf<typeof LoginTypes>["body"]