import { Request } from 'express';
import { Types } from 'mongoose';

export interface CreateOrganizationRequest extends Request {
    body: {
        name: string;
    };
    user: {
        _id: Types.ObjectId;
        joinOrganization: (orgId: Types.ObjectId) => Promise<void>;
    };
}

export interface AddMemberRequest extends Request {
    body: {
        organizationId: Types.ObjectId;
        userId: Types.ObjectId;
    };
    user: {
        _id: Types.ObjectId;
    };
} 