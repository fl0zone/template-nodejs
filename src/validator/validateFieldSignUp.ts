import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

//* Custom interface to extend the Request interface with a body property
interface SignUpRequest extends Request {
  body: {
    email: string;
    password: string;
    name: string;
    role: "admin" | "user";
  };
}

//* Middleware function to validate the fields in the sign up request
const validateFieldSignUp = [
  //* Check if the email field is not empty and is a valid email address
  check("email").not().isEmpty().isEmail().withMessage("Email is required"),

  //* Check if the password field is not empty and has a minimum length of 6 characters
  check("password")
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage("Password is required"),

  //* Check if the name field is not empty
  check("name").not().isEmpty().withMessage("Name is required"),

  //* Check if the role field is not empty and is either "admin" or "user"
  check("role")
    .not()
    .isEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "user"])
    .withMessage("Role must be admin or user"),

  //* Middleware function to check the validation results and handle errors
  (req: SignUpRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateFieldSignUp
