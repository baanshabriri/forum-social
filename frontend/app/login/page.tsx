
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (isAuthenticated) {
        router.push('/');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ username, password });
            router.push('/');
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12" >
            <div className="bg-white border rounded-lg p-8 shadow-sm" >
                <h1 className="text-2xl font-bold mb-6 text-center" > Login </h1>

                {
                    error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm" >
                            {error}
                        </div>
                    )
                }

                <form onSubmit={handleSubmit} className="space-y-4" >
                    <div>
                        <label className="block text-sm font-medium mb-2" >
                            Username
                        </label>
                        < input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)
                            }
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    < div >
                        <label className="block text-sm font-medium mb-2" >
                            Password
                        </label>
                        < input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    < button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                < p className="mt-6 text-center text-sm text-gray-600" >
                    Don't have an account?{' '}
                    < Link href="/signup" className="text-orange-600 hover:underline" >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}