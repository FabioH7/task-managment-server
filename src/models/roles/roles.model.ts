import { Schema, model } from 'mongoose';
import { Types } from 'mongoose';

interface IRole {
    name: string;
    permissions: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const rolesSchema = new Schema<IRole>({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['admin', 'superAdmin', 'user'],
        trim: true
    },
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: 'Permission',
        required: true
    }]
}, {
    timestamps: true
});

rolesSchema.methods.hasPermission = async function(permissionCode: string): Promise<boolean> {
    await this.populate('permissions');
    return this.permissions.some((p: any) => p.code === permissionCode);
};

rolesSchema.methods.addPermission = async function(permissionId: Types.ObjectId) {
    if (!this.permissions.includes(permissionId)) {
        this.permissions.push(permissionId);
        await this.save();
    }
};

rolesSchema.methods.removePermission = async function(permissionId: Types.ObjectId) {
    this.permissions = this.permissions.filter(
        (p: Types.ObjectId) => !p.equals(permissionId)
    );
    await this.save();
};

const Role = model<IRole>('Role', rolesSchema);

export default Role;

