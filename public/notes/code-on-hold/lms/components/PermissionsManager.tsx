"use client"
import React, { useEffect, useState } from 'react';

import { fetchCollections } from '@/utilities/fetchCollections';
import { useField } from '@payloadcms/ui';

type Collection = {
  label: string;
  value: string;
};

type Permission = {
  collection: string;
  actions: string[];
};

const PermissionsManager: React.FC = () => {
  const { value, setValue } = useField<Permission[]>({ path: 'permissions' });
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const fetchedCollections = await fetchCollections();
        setCollections(fetchedCollections as any);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      }
    };
    loadCollections();
  }, []);

  const handlePermissionChange = (collectionSlug: string, action: string, checked: boolean) => {
    const updatedPermissions = [...(value || [])];
    const existingPermissionIndex = updatedPermissions.findIndex(p => p.collection === collectionSlug);

    if (existingPermissionIndex > -1) {
      const existingPermission = updatedPermissions[existingPermissionIndex];
      if (existingPermission) {
        if (checked) {
          existingPermission.actions.push(action);
        } else {
          existingPermission.actions = existingPermission.actions.filter(a => a !== action);
        }
      }
    } else if (checked) {
      updatedPermissions.push({ collection: collectionSlug, actions: [action] });
    }

    setValue(updatedPermissions);
  };
  return (
    <div className="permissions-manager">
      <h3>Permissions</h3>
      <table className="permissions-table">
        <thead>
          <tr>
            <th>Collection</th>
            <th>Create</th>
            <th>Read</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((collection) => (
            <tr key={collection.value}>
              <td>{collection.label}</td>
              {['create', 'read', 'update', 'delete'].map((action) => (
                <td key={action}>
                  <input
                    type="checkbox"
                    checked={value?.some(p => p.collection === collection.value && p.actions.includes(action)) || false}
                    onChange={(e) => handlePermissionChange(collection.value, action, e.target.checked)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionsManager;

