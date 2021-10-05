import { RegisterInput } from "../types/RegisterInput";

export const validateRegisterInput = (registerInput: RegisterInput) => {
    if(!registerInput.email.includes('@')){
        return {
            message:'Invalid email',
            errors: [
                {
                    field:'email',message:'Email must include @ symbol'
                }
            ]
        }
    }
    if(!registerInput.username.includes('@')){
        return {
            message:'Invalid username',
            errors: [
                {
                    field:'username',message:'username must not include @ symbol'
                }
            ]
        }
    }
    if(registerInput.username.length <= 2){
        return {
            message:'Invalid username',
            errors: [
                {
                    field:'username',message:'username be hon 2 ky tu'
                }
            ]
        }
    }
    if(registerInput.password.length <=2 ){
        return {
            message:'Invalid password',
            errors: [
                {
                    field:'password',message:'password be hon 2 ky tu'
                }
            ]
        }
    }
    return null;
}