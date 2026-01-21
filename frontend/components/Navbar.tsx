'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="bg-orange-500 text-white py-2 px-4 border-b-2 border-orange-600">
            <div className="max-w-6xl mx-auto">
                {/* First Line: Brand and User */}
                <div className="flex items-center justify-between mb-1">
                    <Link href="/" className="font-bold text-xl hover:text-orange-100">
                        4umSocial
                    </Link>

                    <div className="text-sm">
                        {isAuthenticated ? (
                            <span className="text-orange-100">
                                {user?.username || 'user'}
                            </span>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="hover:text-orange-100">
                                    login
                                </Link>
                                <span>|</span>
                                <Link href="/signup" className="hover:text-orange-100">
                                    signup
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Second Line: Navigation Links */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="hover:text-orange-100">
                            new
                        </Link>
                        <span>|</span>
                        <Link href="/?sort=top" className="hover:text-orange-100">
                            top
                        </Link>
                        <span>|</span>
                        <Link href="/?sort=best" className="hover:text-orange-100">
                            best
                        </Link>
                        {isAuthenticated && (
                            <>
                                <span>|</span>
                                <Link href="/submit" className="hover:text-orange-100">
                                    submit
                                </Link>
                            </>
                        )}
                    </div>

                    <div>
                        {isAuthenticated && (
                            <button
                                onClick={logout}
                                className="hover:text-orange-100"
                            >
                                logout
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}