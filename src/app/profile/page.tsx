'use client';

import { UserProfile } from '@clerk/nextjs';

export default function ProfilePage() {
  return (
    <div className="flex justify-center pt-10">
      <UserProfile />
    </div>
  );
}
