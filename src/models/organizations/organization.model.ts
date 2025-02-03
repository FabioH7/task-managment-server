import { Schema, model, Types } from 'mongoose';

interface IOrganization {
    name: string;
    admin: Types.ObjectId;
    members: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    addMember: (userId: Types.ObjectId) => Promise<void>;
    removeMember: (userId: Types.ObjectId) => Promise<void>;
}

const organizationSchema = new Schema<IOrganization>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

organizationSchema.methods.addMember = async function(userId: Types.ObjectId) {
    if (!this.members.includes(userId)) {
        this.members.push(userId);
        await this.save();
    }
};

organizationSchema.methods.removeMember = async function(userId: Types.ObjectId) {
    this.members = this.members.filter(
        (memberId: Types.ObjectId) => !memberId.equals(userId)
    );
    await this.save();
};

const Organization = model<IOrganization>('Organization', organizationSchema);

export default Organization; 