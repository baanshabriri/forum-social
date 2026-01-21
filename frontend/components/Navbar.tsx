// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="bg-orange-500 text-white py-2 px-4 border-b-2 border-orange-600">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-bold text-xl hover:text-orange-100">
                        HN Clone
                    </Link>
                    <div className="flex gap-4 text-sm">
                        <Link href="/" className="hover:text-orange-100">
                            new
                        </Link>
                        <Link href="/?sort=top" className="hover:text-orange-100">
                            top
                        </Link>
                        <Link href="/?sort=best" className="hover:text-orange-100">
                            best
                        </Link>
                        {isAuthenticated && (
                            <Link href="/submit" className="hover:text-orange-100">
                                submit
                            </Link>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                    {isAuthenticated ? (
                        <>
                            <span className="text-orange-100">
                                {user?.username || 'user'}
                            </span>
                            <button
                                onClick={logout}
                                className="hover:text-orange-100"
                            >
                                logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-orange-100">
                                login
                            </Link>
                            <Link href="/signup" className="hover:text-orange-100">
                                signup
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}