import { User } from "@/modals/User";


export const userService = async (firebaseUid: string, email: string | undefined, name: string | undefined, avatar: string | undefined) => {
     let user = await User.findOne({ firebaseUid });
     if (user) return user;

     if(!user){
        user = await User.create({ firebaseUid, email, name, avatar });
     }
     return user;
}