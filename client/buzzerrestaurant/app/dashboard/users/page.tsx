'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../../lib/axios';
import { getIdToken } from '../../lib/firebase';
import { AdminTable, Column } from '../../components/admin/AdminTable';
import { AdminUser, UsersResponse } from '../../types/user';

export default function UsersPage() {
  const { data: users = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const idToken = await getIdToken();
      if (!idToken) throw new Error('User not authenticated');

      const response = await api.get<UsersResponse>('/admin/users', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch users');
    },
    staleTime: 5 * 60 * 1000,
  });

  const columns: Column<AdminUser>[] = [
    {
      key: 'image',
      header: 'Image',
      render: (user) => (
        <div className="w-12 h-12 rounded-full overflow-hidden">
          {user.image ? (
            <img
              src={user.image}
              alt={user.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'fullName',
      header: 'Name',
      render: (user) => (
        <span className="font-semibold text-gray-900">{user.fullName}</span>
      ),
    },
    {
      key: 'mobileNumber',
      header: 'Mobile',
      render: (user) => (
        <span className="text-gray-600">{user.mobileNumber}</span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (user) => (
        <span className="text-gray-600">{user.email || 'N/A'}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (user) => (
        <span
          className={`px-2 py-1 rounded-md text-sm font-medium ${
            user.type === 'admin'
              ? 'bg-[#FFB800] text-black'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {user.type || 'user'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (user) => (
        <span className="text-gray-600 text-sm">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">View all registered users</p>
        </div>
      </div>

      <AdminTable
        data={users}
        columns={columns}
        loading={isLoading}
        emptyMessage="No users found."
      />
    </div>
  );
}

