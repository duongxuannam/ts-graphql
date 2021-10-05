import { Arg, Mutation, Resolver } from "type-graphql";
import argon2 from 'argon2'
import { User } from "../models/User";
import { UserMutationResponse } from "../types/UserMutationResponse";
import { RegisterInput } from "../types/RegisterInput";
import { validateRegisterInput } from "../utils/validateRegisterInput";
import { LoginInput } from "../types/LoginInput";

@Resolver()
export class UserResolver {
    @Mutation(_type => UserMutationResponse)
    async register(
        @Arg('registerInput') registerInput: RegisterInput
    ): Promise<UserMutationResponse> {
        const validateRegisterInputErrors = validateRegisterInput(registerInput)
        if (validateRegisterInputErrors !== null) {
            return {
                ...validateRegisterInputErrors,
                code: 400,
                success: false,
            }
        }
        try {
            const { username, email, password } = registerInput
            const existingUser = await User.findOne({
                where: [{ username }, { email }]
            })
            if (existingUser) return {
                code: 400,
                success: false,
                message: 'Duplicate ...',
                errors: [
                    {
                        field: existingUser.username === username ? 'username' : 'email',
                        message: `${existingUser.username === username ? 'username' : 'email'} already taken`,
                    }
                ]
            };

            const hashedPassword = await argon2.hash(password)

            const newUser = User.create({
                username,
                password: hashedPassword,
                email
            })
            const user = await User.save(newUser)
            return {
                code: 200,
                success: true,
                message: 'Create User Success',
                user
            }
        } catch (error) {
            console.log('errror', error)
            return {
                code: 500,
                success: false,
                message: `Internal server error ${error.message}`,

            };
        }

    }


    @Mutation(_type => UserMutationResponse)
    async login(
        @Arg('loginInput') loginInput: LoginInput
    ): Promise<UserMutationResponse> {
        try {
            const { usernameOrEmail, password } = loginInput
            const existingUser = await User.findOne(usernameOrEmail.includes('@') ? {email:usernameOrEmail} : {username:usernameOrEmail})
            if (!existingUser) return {
                code: 400,
                success: false,
                message: 'User not found',
                errors: [
                    {
                        field: 'usernameOrEmail',
                        message: `username or email ko otn  tai`,
                    }
                ]
            };
            const isPasswordValid = await argon2.verify(existingUser.password, password)

            if(!isPasswordValid){
                return {
                    code: 400,
                    success: false,
                    message: 'Wrong password',
                    errors: [
                        {
                            field: 'password',
                            message: `Wrong password`,
                        }
                    ]
                }
            }
            return {
                code: 200,
                success: true,
                message: 'Login Success',
                user:existingUser
            }
        } catch (error) {
            console.log('errror', error)
            return {
                code: 500,
                success: false,
                message: `Internal server error ${error.message}`,

            };
        }

    }
}