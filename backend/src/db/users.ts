import mongoose from "mongoose";
import { authentication } from "../helpers"; 

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
    }
})

export const UserModel = mongoose.model('User', UserSchema);

export const getUser = () => UserModel.find();

export const getUserByEmail = (email: string) => UserModel.findOne({ email });

export const getUserByNick = (username: string) => UserModel.findOne({ username });

export const getUserByID = (id: string) => UserModel.findById(id);

// Buscar un usuario por nickname y contraseña
export const getUserByNicknameAndPassword = async (username: string, password: string) => {
    try {
        const user = await UserModel.findOne({ username }).select('+authentication.password +authentication.salt +authentication.sessionToken');
        if (!user) return null;

        const hashedPassword = authentication(user.authentication.salt, password);
        if (hashedPassword === user.authentication.password) {
            return user; // Si la contraseña coincide
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error while authenticating user:", error);
        throw error;
    }
};

export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) => UserModel.findOneAndDelete( {_id: id} );

export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);