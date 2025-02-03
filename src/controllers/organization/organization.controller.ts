import { Response } from 'express';
import Organization from '@models/organizations/organization.model';
import User from '@models/users/user.model';
import { CreateOrganizationRequest, AddMemberRequest } from './requests';

export const createOrganization = async (req: CreateOrganizationRequest, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        const userId = req.user._id;

        const organization = await Organization.create({
            name,
            admin: userId,
            members: [userId]
        });

        await req.user.joinOrganization(organization._id);

        res.status(201).json(organization);
    } catch (error) {
        res.status(500).json({ message: 'Error creating organization' });
    }
};

export const addMember = async (req: AddMemberRequest, res: Response): Promise<void> => {
    try {
        const { organizationId, userId } = req.body;
        
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            res.status(404).json({ message: 'Organization not found' });
            return;
        }

        if (!organization.admin.equals(req.user._id)) {
            res.status(403).json({ message: 'Only admin can add members' });
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        await organization.addMember(userId);
        await user.joinOrganization(organizationId);

        res.status(200).json({ message: 'Member added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding member' });
    }
}; 