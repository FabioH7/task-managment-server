import { Router } from 'express';
import { createOrganization, addMember } from '@controllers/organization/organization.controller';
import { CreateOrganizationRequest, AddMemberRequest } from '@controllers/organization/requests';

const router = Router();

router.post(
    '/create',
    (req, res) => createOrganization(req as CreateOrganizationRequest, res)
);

router.post(
    '/members/add', 
    (req, res) => addMember(req as AddMemberRequest, res)
);

export { router }; 