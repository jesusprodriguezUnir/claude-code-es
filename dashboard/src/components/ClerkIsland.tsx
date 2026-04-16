import { ClerkProvider } from '@clerk/clerk-react';

const clerkKey = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY;
const isValidClerkKey =
  typeof clerkKey === 'string' &&
  /^pk_(test|live)_[a-zA-Z0-9]+$/.test(clerkKey) &&
  !clerkKey.includes('your_key_here');

export default function ClerkIsland() {
  if (!isValidClerkKey) return null;
  return (
    <ClerkProvider publishableKey={clerkKey}>
      <span />
    </ClerkProvider>
  );
}
