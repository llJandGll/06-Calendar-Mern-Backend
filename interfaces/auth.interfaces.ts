export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  message: string;
  status: number;
  user: {
    uid: string;
    name: string;
    email: string;
    token: string;
  }
}

export interface ILoginRequest {
  email: string;
  password: string;
  role: string;
}

export interface IRegisterRequest extends ILoginRequest {
  name: string;
}

export interface IJwtPayload {
  uid: string;
  name: string;
}