import mongoose from 'mongoose';
import Role from '@models/roles/roles.model';
import Permission from '@models/permissions/permission.model';

const seedDatabase = async () => {
    try {
        // Define all permissions that should exist
        const permissionsList = [
            {
                name: 'Create User',
                description: 'Can create new users',
                code: 'CREATE_USER'
            },
            {
                name: 'Update User',
                description: 'Can update user details',
                code: 'UPDATE_USER'
            },
            {
                name: 'Delete User',
                description: 'Can delete users',
                code: 'DELETE_USER'
            },
            {
                name: 'View Users',
                description: 'Can view user list',
                code: 'VIEW_USERS'
            },
            {
                name: 'Manage Roles',
                description: 'Can manage roles',
                code: 'MANAGE_ROLES'
            },
            {
                name: 'Create Organization',
                description: 'Can create new organizations',
                code: 'CREATE_ORGANIZATION'
            },
            {
                name: 'Manage Organization',
                description: 'Can manage organization settings',
                code: 'MANAGE_ORGANIZATION'
            },
            {
                name: 'Invite Members',
                description: 'Can invite members to organization',
                code: 'INVITE_MEMBERS'
            },
            {
                name: 'Remove Members',
                description: 'Can remove members from organization',
                code: 'REMOVE_MEMBERS'
            }
        ];

        // Upsert all permissions
        const permissions = await Promise.all(
            permissionsList.map(async (permission) => {
                return await Permission.findOneAndUpdate(
                    { code: permission.code },
                    permission,
                    { upsert: true, new: true }
                );
            })
        );

        // Define roles with their permissions
        const rolesList = [
            {
                name: 'user',
                permissions: [
                    permissions.find(p => p.code === 'VIEW_USERS')?._id
                ]
            },
            {
                name: 'admin',
                permissions: permissions.map(p => p._id)
            },
            {
                name: 'superAdmin',
                permissions: permissions.map(p => p._id)
            },
            {
                name: 'orgAdmin',
                permissions: [
                    permissions.find(p => p.code === 'MANAGE_ORGANIZATION')?._id,
                    permissions.find(p => p.code === 'INVITE_MEMBERS')?._id,
                    permissions.find(p => p.code === 'REMOVE_MEMBERS')?._id
                ]
            }
        ];

        // Upsert all roles
        await Promise.all(
            rolesList.map(async (role) => {
                return await Role.findOneAndUpdate(
                    { name: role.name },
                    role,
                    { upsert: true, new: true }
                );
            })
        );

        console.log('Database seeded/updated successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

export default seedDatabase;