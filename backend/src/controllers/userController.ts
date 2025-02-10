import prisma from "../config/database";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail";
import jwt from "jsonwebtoken";
import ms from "ms";

import crypto from "crypto";
import { Request, Response } from "express";
import {
  ForgotPasswordBody,
  IUser,
  IUserLogin,
  ResetPasswordBody,
  ResetPasswordParams,
  UpdatePasswordBody,
} from "../types/user";
import { generateAccessAndRefreshTokens } from "../utils/sendToken";
import { JwtPayload } from "../middleware/auth";
import { generateRandomColor } from "../utils/generateColor";

/**
 * register
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const register = async (
  req: Request<{}, {}, IUser>,
  res: Response
): Promise<void> => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !email || !password || !username) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    const existingUserUsername = await prisma.user.findUnique({
      where: { username: username },
    });

    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    if (existingUser) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    // Hashed password for email authentication
    let password_hash: string | null = null;

    const salt = await bcrypt.genSalt(10);
    password_hash = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: password_hash,
        verification_token: hashedToken,
        is_verified: false,
        verification_token_expiry: expiry,
        color: generateRandomColor(),
      },
    });

    //Here i am going to generate verification token

    if (newUser) {
      const verificationUrl = `${process.env.CLIENT_URL}/verify/email/${verificationToken}`;

      const htmlMessage = `
   
        Hello ${name},
        
        Welcome to our platform! Please verify your email by clicking the link below:
        
       ${verificationUrl} Verify Email
        
        If you did not create an account, please ignore this email.
        
        Best regards,
        The Infloso AI Team
       `;

      await sendEmail({
        email,
        subject: "Verify your email address",
        message: htmlMessage,
      });

      const WelcomeMessage = `
          Hello ${name},

          Welcome to the Infloso AI Platform! We're excited to have you on board. You've successfully registered, and your account is now ready to use.

          If you have any questions or need assistance, feel free to reach out to our support team.

          We look forward to helping you achieve great things on our platform!

          Best regards,
          The Infloso AI Team
       `;
      await sendEmail({
        email,
        subject: "Welcome to the Infloso AI Platform",
        message: WelcomeMessage,
      });
    }
    res.status(201).json({
      success: true,
      message: "User created successfully. Please verify your email.",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

/**
 * Verify email after user clicks verification link
 * @param {Request} req
 * @param {Response} res
 */

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        verification_token: hashedToken,
        verification_token_expiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired verification link" });
      return;
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        is_verified: true,
        verification_token: null,
        verification_token_expiry: null,
      },
    });

    res
      .status(200)
      .json({ message: "Email verified successfully, you can now log in." });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * login
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const login = async (
  req: Request<{}, {}, IUserLogin>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    //if user is still not verified
    if (!user.is_verified) {
      const currentTime = new Date();

      if (
        !user.verification_token_expiry ||
        currentTime > user.verification_token_expiry
      ) {
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
          .createHash("sha256")
          .update(verificationToken)
          .digest("hex");
        const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.user.update({
          where: { email: email },
          data: {
            verification_token: hashedToken,
            verification_token_expiry: expiryTime,
          },
        });

        const verificationUrl = `${process.env.CLIENT_URL}/verify/email/${verificationToken}`;

        const message = `
          Hello ${user.name},

          Your previous verification link has expired. Please verify your email by clicking the link below:

          ${verificationUrl}

          If you did not request this, please ignore this email.

          Best regards,
          The Team
        `;

        await sendEmail({
          email,
          subject: "Resend: Verify your email address",
          message,
        });

        res.status(400).json({
          message:
            "Verification link expired. A new link has been sent to your email.",
        });
        return;
      } else {
        res.status(400).json({
          message: `Email not verified. Please check your inbox.`,
        });
        return;
      }
    }

    if (!user.password) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        last_login_at: new Date(),
      },
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user.id
    );
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...options,
        maxAge: 30 * 60 * 1000,
        sameSite: "strict",
      }) // 30 minutes
      .cookie("refreshToken", refreshToken, {
        ...options,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
      }) // 1 days
      .json({
        success: true,
        message: "Logged in successfully",
        user,
        refreshToken,
        accessToken,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * logout
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.body.user;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Set refreshToken to NULL

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshtoken: null,
      },
    });

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res
      .status(200)
      .clearCookie("accessToken", {
        ...options,
        maxAge: 0,
        sameSite: "none",
      })
      .clearCookie("refreshToken", {
        ...options,
        maxAge: 0,
        sameSite: "none",
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Refresh Access Token
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let decodedToken: JwtPayload;

    try {
      decodedToken = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as JwtPayload;
    } catch (err) {
      res.status(401).json({ message: "Invalid or expired refresh token" });
      return;
    }

    const userId = decodedToken.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    if (token !== user?.refreshtoken) {
      res.status(401).json({ message: "Refresh token expired or used" });
      return;
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user.id
    );

    const options = {
      httpOnly: true,
      secure: true, // Secure only in production
      sameSite: "Strict",
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...options,
        maxAge: 30 * 60 * 1000,
        sameSite: "strict",
      }) // 30 minutes
      .cookie("refreshToken", refreshToken, {
        ...options,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
      }) // 1 days
      .json({
        success: true,
        message: "Access token refreshed",
        accessToken,
      });
  } catch (error: any) {
    console.error("Error refreshing token:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get user details
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const getUserDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body.user;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update user details
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */

export const updateUserDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body.user;
    const { name, email, username, password }: IUser = req.body;

    let password_hash = password;
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password: password_hash,
        username,
      },
    });

    res.status(200).json({
      success: true,
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update user password
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const updateUserPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body.user;
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    }: UpdatePasswordBody = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.password) {
      res.status(400).json({ message: "Password is required" });
      return;
    }

    const isValidatePassword = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isValidatePassword) {
      res.status(400).json({ message: "Invalid current password" });
      return;
    }

    if (newPassword !== confirmPassword) {
      res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id },
      data: { password: password_hash },
    });

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * // //forgot password
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */

export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordBody>,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    if (!validateEmail(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const tokenExpiration = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        reset_password_token: hashedToken,
        reset_password_token_expires: tokenExpiration,
      },
    });

    if (!process.env.CLIENT_URL) {
      console.error("CLIENT_URL environment variable is not defined.");
      res.status(500).json({ message: "Server configuration error." });
      return;
    }

    const resetPasswordUrl = `${process.env.CLIENT_URL}/reset/password/${resetToken}`;

    const message = `You Password reset token is :-\n\n ${resetPasswordUrl} \n\n
  If you have not requested this email then, please ignore it `;

    await sendEmail({
      email: user.email,
      subject: `Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Password reset email sent to ${user.email}. Please check your inbox.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Reset user password after clicking on reset password link
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const resetPassword = async (
  req: Request<ResetPasswordParams, {}, ResetPasswordBody>,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      res
        .status(400)
        .json({ message: "Password and confirm password are required" });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        reset_password_token: resetPasswordToken,
        reset_password_token_expires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: "Invalid or expired token" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        reset_password_token: null,
        reset_password_token_expires: null,
      },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
