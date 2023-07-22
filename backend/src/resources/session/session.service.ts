import UserModel from '@/resources/user/user.model';
import SessionModel from '@/resources/session/session.model';
import {CreateSessionInterface} from '@/resources/session/session.interface';
import log from '@/utils/logger';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '@/utils/token';

class SessionService {
    private user = UserModel;
    private session = SessionModel;

    public async createSession(createSessionInput: CreateSessionInterface): Promise<Object | void>{
        const {email, password} = createSessionInput;
        try {
            const user = await this.user.findOne({email: email})
            if(!user){
                throw new Error('Invalid email or password');
            }

            if(!user.verified){
                throw new Error('Invalid email or password');
            }

            const isValid = await user.validatePassword(password);
            if(!isValid){
                throw new Error('Invalid email or password')
            }

            const oldSession = await this.session.findOne({user: user._id});
            if(oldSession){
                await oldSession.remove();
            }

            const session = await this.session.create({user: user._id});

            // Sign access token 
            const accessToken = createAccessToken(user);

            // Sign refresh Token 
            const refreshToken = createRefreshToken(session._id as any as string)

            return {user, accessToken, refreshToken};
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async refreshSession(refreshToken: string): Promise<string | Error> {
        try {
            if(!refreshToken){
                throw new Error('Refresh token not provided')
            }
            const decoded = verifyRefreshToken<{session: string}>(refreshToken);

            if(!decoded){
                throw new Error("Could not refresh token")
            }

            const session = await this.session.findById({_id: decoded.session});

            if(!session || !session.valid){
                throw new Error("Could not refresh token")
            }

            const user = await this.user.findById({_id: session.user});

            if(!user){
                throw new Error("Could not refresh token");
            }

            const accessToken = createAccessToken(user);

            return accessToken;

        } catch (e: any) {
            throw new Error(e.message)
        }
    }

    public async endSession(userId: string): Promise<string | Error> {
        try {
            const session = await this.session.findOne({user: userId});
            if(!session){
                throw new Error('You are currently logged out');
            }

            await session.remove();
            return 'You have been successfully logged out'
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}

export default SessionService;