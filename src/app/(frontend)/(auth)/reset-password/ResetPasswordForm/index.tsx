'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type FormData = {
  password: string;
  confirmPassword: string;
};

const ResetPasswordForm: React.FC<{ token: string }> = ({ token }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred while resetting your password.');
      }
    } catch (err) {
      setError('An error occurred while resetting your password. Please try again.');
    }
  };

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Password Set Successfully</CardTitle>
          <CardDescription>Your password has been successfully set. You can now log in with your new password.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push('/admin/login')}>Go to Login</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Your Password</CardTitle>
        <CardDescription>Enter your new password below to complete your registration or reset your password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="New Password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirm New Password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val: string) => {
                    if (watch('password') != val) {
                      return "Your passwords do not match";
                    }
                  },
                })}
              />
              {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit">Set Password</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;

