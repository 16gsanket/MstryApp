import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(2, 'Username should be atleast 2 charecters')
    .max(20, 'username must be no longer than 20')


export const signUpSchema = z.object(
    {
        username : usernameValidation,
        email : z.string().email({message : "Inavlid e-mail address"}),
        password : z.string().min(6 , {message : "Password must be atleast 6 charecter long"})
    }
)