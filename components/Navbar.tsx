'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from './Logo';
import { logOut } from '@/lib/actions/authActions';
import { useSession } from 'next-auth/react';

interface NavLink {
    name: string;
    href: string;
}

export interface UserType {
    name: string;
    email: string;
    image: string;
}

export default function Navbar() {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [user, setUser] = useState<UserType | null>(null);

    const {data, status} = useSession();

    const userDropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (status === "authenticated" && data?.user) {
            if(data?.user?.image){
                const userData = {
                    name: data.user.name!,
                    email: data.user.email!,
                    image: data.user.image
                };

                setUser(userData);
            } else{
                (async() => {
                    const res = await fetch(`/api/user/get-image?email=${data.user?.email}`);
                    
                    if(res.ok){
                        const { image } = await res.json();

                        setUser({
                            name: data.user!.name!,
                            email: data.user!.email!,
                            image
                        }) 
                    } else{
                        console.log('Error in fetching user image.');

                        setUser({
                            name: data.user!.name!,
                            email: data.user!.email!,
                            image: '/man.svg' // fallback image set to man avatar
                        })
                    }
                })();
            }
        } else if (status === "unauthenticated") {
            setUser(null);
            console.log("unauthenticated");
        }
    }, [data, status]);
    
    const navLinks: NavLink[] = [
        { name: 'Explore', href: '/movies' },
        { name: 'Bookings', href: '/bookings' }
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        }

        if (isUserDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserDropdownOpen]);

    const handleUserClick = (): void => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleMobileMenuToggle = (): void => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = (): void => {
        setIsUserDropdownOpen(false);
        setIsMobileMenuOpen(false);
        logOut();
    };

    const closeMobileMenu = (): void => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <Logo />

                    {/* Navigation Links - Hidden on mobile */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-zinc-300 hover:text-white transition-colors duration-200 font-light tracking-wide"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop User Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            /* Logged In User */
                            <div className="relative" ref={userDropdownRef}>
                                <button
                                    onClick={handleUserClick}
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors duration-200"
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-zinc-600/50 hover:border-zinc-500/70 transition-colors relative">
                                        <Image
                                            src={user.image}
                                            alt={user.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-zinc-300 font-light">
                                        {user.name.split(' ')[0]}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                                            isUserDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* User Dropdown */}
                                {isUserDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800/50 rounded-xl shadow-2xl py-2 animate-in fade-in-0 zoom-in-95 duration-200">
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-zinc-800/50">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-600/50 relative">
                                                    <Image
                                                        src={user.image}
                                                        alt={user.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium text-sm">{user.name}</p>
                                                    <p className="text-zinc-400 text-xs">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dropdown Items */}
                                        <div className="py-1">
                                            <Link
                                                href="/profile"
                                                className="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-white transition-colors"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Profile
                                            </Link>
                                            <div className="border-t border-zinc-800/50 my-1"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-white transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Not Logged In */
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/login"
                                    className="text-zinc-300 hover:text-white transition-colors duration-200 font-light px-4 py-2 rounded-lg hover:bg-zinc-800/50"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-gradient-to-r from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500 text-white font-light px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={handleMobileMenuToggle}
                        className="md:hidden p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
                        aria-expanded={isMobileMenuOpen}
                        aria-label="Toggle mobile menu"
                    >
                        <div className="relative w-5 h-5 flex items-center justify-center">
                            {/* Hamburger/Close Icon with smooth transition */}
                            <div className="absolute inset-0 flex flex-col justify-center space-y-1">
                                <span 
                                    className={`block h-0.5 w-5 bg-zinc-300 transition-all duration-300 ease-in-out transform ${
                                        isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : 'rotate-0 translate-y-0'
                                    }`}
                                />
                                <span 
                                    className={`block h-0.5 w-5 bg-zinc-300 transition-all duration-300 ease-in-out ${
                                        isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                                    }`}
                                />
                                <span 
                                    className={`block h-0.5 w-5 bg-zinc-300 transition-all duration-300 ease-in-out transform ${
                                        isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'rotate-0 translate-y-0'
                                    }`}
                                />
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <div 
                className={`md:hidden fixed inset-0 top-16 bg-black/20 backdrop-blur-sm transition-all duration-300 ease-in-out z-30 ${
                    isMobileMenuOpen 
                        ? 'opacity-100 pointer-events-auto' 
                        : 'opacity-0 pointer-events-none'
                }`}
                onClick={closeMobileMenu}
            />

            {/* Mobile Navigation Menu */}
            <div 
                ref={mobileMenuRef}
                className={`md:hidden absolute top-full left-0 right-0 bg-zinc-900/95 backdrop-blur-sm shadow-2xl z-40 transition-all duration-300 ease-in-out transform origin-top ${
                    isMobileMenuOpen 
                        ? 'opacity-100 scale-y-100 translate-y-0' 
                        : 'opacity-0 scale-y-0 -translate-y-2'
                }`}
            >
                <div className="px-4 py-3 space-y-1">
                    {/* Navigation Links with staggered animation */}
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`block px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-300 transform ${
                                isMobileMenuOpen 
                                    ? 'translate-x-0 opacity-100' 
                                    : 'translate-x-4 opacity-0'
                            }`}
                            style={{ 
                                transitionDelay: isMobileMenuOpen ? `${(index + 1) * 50}ms` : '0ms' 
                            }}
                            onClick={closeMobileMenu}
                        >
                            {link.name}
                        </Link>
                    ))}
                    
                    {/* Mobile User Section */}
                    {user ? (
                        <div 
                            className={`pt-3 transition-all duration-300 transform ${
                                isMobileMenuOpen 
                                    ? 'translate-x-0 opacity-100' 
                                    : 'translate-x-4 opacity-0'
                            }`}
                            style={{ 
                                transitionDelay: isMobileMenuOpen ? '150ms' : '0ms' 
                            }}
                        >
                            {/* User Info in Mobile */}
                            <div className="flex items-center px-3 py-2 mb-2">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-600/50 mr-3 relative">
                                    <Image
                                        src={user.image}
                                        alt={user.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">{user.name}</p>
                                    <p className="text-zinc-400 text-xs">{user.email}</p>
                                </div>
                            </div>
                            
                            {/* Mobile Menu Items */}
                            <Link
                                href="/profile"
                                className="flex items-center px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors duration-200"
                                onClick={closeMobileMenu}
                            >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full text-left px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        /* Mobile Not Logged In */
                        <div 
                            className={`pt-3 space-y-2 transition-all duration-300 transform ${
                                isMobileMenuOpen 
                                    ? 'translate-x-0 opacity-100' 
                                    : 'translate-x-4 opacity-0'
                            }`}
                            style={{ 
                                transitionDelay: isMobileMenuOpen ? '150ms' : '0ms' 
                            }}
                        >
                            <Link
                                href="/login"
                                className="block px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors duration-200"
                                onClick={closeMobileMenu}
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="block px-3 py-2 bg-gradient-to-r from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500 text-white font-light rounded-lg transition-all duration-200 text-center"
                                onClick={closeMobileMenu}
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}