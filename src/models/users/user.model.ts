import { Schema, model } from 'mongoose';
import { Types } from 'mongoose';
import Role from '@models/roles/roles.model'
import Organization from '../organizations/organization.model';

interface IUser {
    username: string;
    email: string;
    password: string;
    role: Types.ObjectId;
    permissions: Types.ObjectId[];
    organizations: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    hasPermission: (permissionCode: string) => Promise<boolean>;
    joinOrganization: (orgId: Types.ObjectId) => Promise<void>;
    leaveOrganization: (orgId: Types.ObjectId) => Promise<void>;
}

const usersSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: 'Permission',
        default: []
    }],
    organizations: [{
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        default: []
    }]
}, {
    timestamps: true
});

// Pre-save middleware to copy role permissions to user permissions
usersSchema.pre('save', async function(next) {
    if (this.isNew) {
        await this.populate('role');
        const roleId = this.get('role');
        const role = await Role.findById(roleId);
        if (!role) {
            throw new Error('Role not found');
        }
        await role.populate('permissions');
        this.permissions = [...role.permissions];
    }
    next();
});

usersSchema.methods.hasPermission = async function(permissionCode: string): Promise<boolean> {
    await this.populate('permissions');
    
    return (this as any).permissions.some((p: any) => p.code === permissionCode);
};

usersSchema.methods.joinOrganization = async function(orgId: Types.ObjectId) {
    if (!this.organizations.includes(orgId)) {
        this.organizations.push(orgId);
        await this.save();
    }
};

usersSchema.methods.leaveOrganization = async function(orgId: Types.ObjectId) {
    this.organizations = this.organizations.filter(
        (org: Types.ObjectId) => !org.equals(orgId)
    );
    await this.save();
};

const User = model<IUser>('User', usersSchema);

export default User;
