// 'use client';

// import { useState, FormEvent } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { register } from '@/lib/authService';
// import { AuthLayout } from '@/components/auth/AuthLayout';
// import { toast } from 'sonner';
// export default function RegisterPage() {
//   const router = useRouter();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [submitting, setSubmitting] = useState(false);

//   async function handleSubmit(e: FormEvent) {
//     e.preventDefault();
//     setError('');

//     if (!name || !email || !password) {
//       setError('Fill in every field to continue.');
//       return;
//     }
//     if (password.length < 8) {
//       setError('Use at least 8 characters for your password.');
//       return;
//     }

//     setSubmitting(true);
//     try {
//       await register(name, email, password);
//       router.push('/login');
//       toast.success('Account created successfully.');
//     } catch (err: any) {
//       setError(err.response?.data?.message ?? 'Couldn\u2019t create your account. Try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <AuthLayout
//       eyebrow="Get started"
//       title="Create your account"
//       subtitle="Set up access to submit and track your weekly reports."
//     >
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition"
//             placeholder="Your full name"
//             autoFocus
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition"
//             placeholder="you@company.com"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition"
//             placeholder="At least 8 characters"
//           />
//         </div>

//         {error && (
//           <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
//             {error}
//           </p>
//         )}

//         <button
//           type="submit"
//           disabled={submitting}
//           className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-lg py-2.5 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {submitting ? 'Creating account…' : 'Create account'}
//         </button>
//       </form>

//       <p className="text-sm text-gray-500 mt-6">
//         Already have an account?{' '}
//         <Link href="/login" className="text-brand-600 font-medium hover:text-brand-700">
//           Log in
//         </Link>
//       </p>
//     </AuthLayout>
//   );
// }
'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/authService';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { toast } from 'sonner';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'TEAM_MEMBER' | 'MANAGER'>('TEAM_MEMBER');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const clearError = () => error && setError('');

  function validate(): string | null {
    if (!name || !email || !password) return 'Fill in every field to continue.';
    if (!EMAIL_REGEX.test(email)) return 'Enter a valid email address.';
    if (password.length < 8) return 'Use at least 8 characters for your password.';
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const response = await register(name, email, password, role);
      toast.success(response?.message ?? 'Account created successfully.');
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Couldn\u2019t create your account. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      subtitle="Set up access to submit and track your weekly reports."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
          <input
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => { setName(e.target.value); clearError(); }}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition"
            placeholder="Your full name"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); clearError(); }}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); clearError(); }}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition"
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a</label>
          <select
            value={role}
            onChange={(e) => { setRole(e.target.value as 'TEAM_MEMBER' | 'MANAGER'); clearError(); }}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition bg-white"
          >
            <option value="TEAM_MEMBER">Team member</option>
            <option value="MANAGER">Manager</option>
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-lg py-2.5 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-600 font-medium hover:text-brand-700">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}