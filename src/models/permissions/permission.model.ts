import { Schema, model } from 'mongoose';

interface IPermission {
    name: string;
    description: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
}

const permissionSchema = new Schema<IPermission>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    }
}, {
    timestamps: true
});

const Permission = model<IPermission>('Permission', permissionSchema);

export default Permission; 