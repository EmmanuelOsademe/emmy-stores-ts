import jwt from 'jsonwebtoken';
import { DocumentType } from '@typegoose/typegoose';
import { privateFields, User } from '@/resources/user/user.model';
import {omit} from 'lodash';

export const createAccessToken = (user: DocumentType<User>) => {
    const payload = omit(user.toJSON(), privateFields);

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY as string, {
        expiresIn: '10m'
    })
}

export const createRefreshToken = (sessionId: string) => {
    const payload = {session: sessionId};

    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY as string, {
        expiresIn: '1d'
    })
}

export function verifyAccessToken<T>(accessToken: string): T | null {
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY as string) as T;
        return decoded;
    } catch (e: any) {
        return null;
    }
}

export function verifyRefreshToken<T>(refreshToken: string): T | null {
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY as string) as T;
        return decoded;
    } catch (e: any) {
        return null;
    }
}