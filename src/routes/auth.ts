import express, { Request, Response } from 'express';
import * as queryString from 'query-string';
import axios from 'axios'
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken'
// import { IGetUserAuthInfoRequest } from "../req"
import { authenticateToken } from '../middlewares/auth'

const prisma = new PrismaClient();

export const loginRoute = express.Router();
export const meRoute = express.Router();
export const authGoogleRoute = express.Router();
export const authGoogleCallbackRoute = express.Router();

type User = { id: string };
type NoUser = {};
type GetUser = (id: string) => User | NoUser;

loginRoute.get('/user/login', async (req: Request, res: Response): Promise<void> => {
  res.json({
    url: require('crypto').randomBytes(64).toString('hex')
  });
});

meRoute.get('/user/me', authenticateToken, (req: Request, res: Response) => {
  if (req.user) {
    // let data:User = {...req.user}
    // if (data.id) {

    // }
    res.json({
      user: req.user
    });
  }
  // if (hasUser(req)) {
  //   let userId = req.user.id!
  //   // console.log("userId: ", userId.id)
  //   // let user2 = await prisma.user.findFirst({
  //   //   where: {
  //   //     id: userId,
  //   //   },
  //   // })
  // }
  return res.status(200).json({ user: req.user });
});

function hasUser(request: Request): request is Request & { user: number} {
  return 'user' in request
}

authGoogleRoute.get('/user/login/google', async (req: Request, res: Response): Promise<void> => {
  const stringifiedParams = {
    client_id: `${process.env.GOOGLE_CLIENT_ID}`,
    redirect_uri: `${process.env.GOOGLE_CALLBACK}`,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '), // space seperated string
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  };
  let queryString = new URLSearchParams(stringifiedParams).toString()

  res.json({
    url: `https://accounts.google.com/o/oauth2/v2/auth?${queryString}`
  });
});

authGoogleCallbackRoute.get('/auth/google/callback', async (req: Request, res: Response): Promise<void> => {
  const accessToken = await getAccessTokenFromCode(req.query.code)
  const googleUserInfo = await getGoogleUserInfo(accessToken)

  if (googleUserInfo.email) {
    const user = await prisma.user.findFirst({
      where: {
        email: googleUserInfo.email,
      },
    })

    if (!user) {
      const user = await prisma.user.create({
        data: {
          name: googleUserInfo.name,
          email: googleUserInfo.email
        }
      })
    } 

    let accessToken = null
    if (user && user.id) {
      accessToken = generateAccessToken(user.id)
    }

    let redirectUrl:string = process.env.FRONTEND_LOGIN_SUCCESS_URL!; 
    return res.redirect(redirectUrl + "?token=" + accessToken );
  }

  res.json({
    code:  req.query.code,
    accessToken: accessToken,
    googleUserInfo: googleUserInfo
  });
});

function generateAccessToken(id: number) {
  if (process.env.TOKEN_SECRET) {
    return jwt.sign({id: id}, process.env.TOKEN_SECRET, { expiresIn: '1800000s' });
  } else {
    return null
  }
}

async function getAccessTokenFromCode(code: any) {
  const { data } = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: `${process.env.GOOGLE_CLIENT_ID}`,
      client_secret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      redirect_uri: process.env.GOOGLE_CALLBACK,
      grant_type: 'authorization_code',
      code,
    },
  });

  return data.access_token;
};

async function getGoogleUserInfo(accessToken: any) {
  const { data } = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
};