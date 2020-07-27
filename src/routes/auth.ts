import express, { Response } from "express";
import { CustomRequest } from "../types/interface";
import auth from "../middleware/auth";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/utils";
import userModel from "../models/user";

const router = express.Router();

// Authentication
// GET list of orgs
// POST certifcate
// POST evaluation (comments) only visible to FSC, CB, ASI
// POST feedback visible to CoC; can be called by CoC and CB
// GET all feedbacks
//
// PUT certifcate status
// PUT evaluation
// GET blockchain certificates
// GET docusign URL

// @route   GET api/auth
// @desc    Authenticate user by token
// @access  Private
router.get("/", auth, async (req: CustomRequest, res: Response) => {
  try {
    // Get user from Auth middleware
    if (req.user) {
      const user = await userModel.findById(req.user.id);
      return res.json(user);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error.");
  }
});

// @route   POST api/auth
// @desc    Login user with email and password and return JWT token
// @access  Private
router.post("/", async (req: CustomRequest, res: Response) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "Invalid credentials." }],
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        errors: [{ msg: "Invalid credentials." }],
      });
    }

    const token = await generateToken(user.id, user.email);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error.");
  }
});

export default router;
