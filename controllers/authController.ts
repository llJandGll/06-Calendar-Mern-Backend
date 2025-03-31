import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '../helpers/jwt';
import { 
  IAuthResponse, 
  ILoginRequest, 
  IRegisterRequest,
  IJwtPayload 
} from '../interfaces/auth.interfaces';

export const createUser = async (
  req: Request<{}, {}, IRegisterRequest>, 
  res: Response
) => {
  const { email, name, password, role } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
        status: 400
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    const token = await generateToken(user._id.toString(), user.name);
    await user.save();
    
    const response: IAuthResponse = {
      message: 'User created successfully',
      status: 201,
      user: {
        uid: user._id.toString(),
        name: user.name,
        email: user.email,
        token
      }
    };

    res.status(201).json(response);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'User creation failed',
      status: 500
    });
  }
}

export const loginUser = async (
  req: Request<{}, {}, ILoginRequest>, 
  res: Response
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'User not found',
        status: 400
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        message: 'Invalid password',
        status: 400
      });
    }

    const token = await generateToken(user._id.toString(), user.name);

    const response: IAuthResponse = {
      message: 'User logged in successfully',
      status: 200,
      user: {
        uid: user._id.toString(),
        name: user.name,
        email: user.email,
        token
      }
    };

    res.status(200).json(response);

  } catch (error) {
    res.status(500).json({
      message: 'User login failed',
      status: 500
    });
  }
}

export const renewToken = async (
  req: Request & { user: IJwtPayload }, 
  res: Response
) => {
  const { uid, name } = req.user;

  try {
    const token = await generateToken(uid, name);

    res.status(200).json({
      message: 'Token renewed successfully',
      status: 200,
      token
    });
  } catch (error) {
    res.status(500).json({
      message: 'Token renewal failed',
      status: 500
    });
  }
}

