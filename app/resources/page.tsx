'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResourcesPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/resources/fire-stations');
  }, [router]);

  return null;
} 