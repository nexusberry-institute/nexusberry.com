// Update your types.ts file to include the new structure
export type TClass = {
  id: number;
  onlineClassLink: string;
  batches: Array<{
    id: number;
    slug: string;
    "training-courses": {
      title: string;
    };
  }>;
  expiry: string;
  updatedAt: string;
  users: Array<{ id: number } | number>;
  type: string;
  batch?: any; // For the processed class items
  enrollmentId?: number | null;
};

export type ClassesResponse = {
  userId: number;
  classes: TClass[];
};