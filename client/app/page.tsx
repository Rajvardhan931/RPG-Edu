import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect the root path to the auth page so users can log in first
  redirect('/auth');
}
