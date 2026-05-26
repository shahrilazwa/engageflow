import { Link, router, usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronDown, faFolderOpen, faHouse, faRightFromBracket, faTableColumns, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useEffect, type FormEvent, type ReactNode } from 'react';
import AppBrand from '@/Components/AppBrand';

type AuthUser = {
    id: number;
    name: string;
    email: string;
};

type PageProps = {
    auth?: {
        user?: AuthUser | null;
    };
};

type SelectedProject = {
    name: string;
    dashboardUrl?: string;
};

type AuthenticatedLayoutProps = {
    children: ReactNode;
    title?: string;
    selectedProject?: SelectedProject | null;
};

type NavigationItem = {
    label: string;
    href?: string;
    active: boolean;
    disabled?: boolean;
    icon: typeof faHouse;
};

/** Get user initials from name (max 2 characters). */
function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

/** Desktop nav item with MYDS-style active underline indicator. */
function DesktopNavItem({ item }: { item: NavigationItem }) {
    const baseClass = 'relative inline-flex h-full items-center gap-1.5 px-3 text-sm font-medium transition';
    const activeIndicator = 'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-blue-600';

    let className: string;
    if (item.disabled) {
        className = `${baseClass} cursor-not-allowed text-gray-400`;
    } else if (item.active) {
        className = `${baseClass} text-gray-950 ${activeIndicator}`;
    } else {
        className = `${baseClass} text-gray-600 hover:text-gray-950`;
    }

    const content = <span>{item.label}</span>;

    if (item.disabled || !item.href) {
        return (
            <span className={className} aria-disabled="true">
                {content}
            </span>
        );
    }

    return (
        <Link href={item.href} className={className}>
            {content}
        </Link>
    );
}

/** Mobile nav item. */
function MobileNavItem({ item, onClick }: { item: NavigationItem; onClick: () => void }) {
    const baseClass = 'flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition';

    let className: string;
    if (item.disabled) {
        className = `${baseClass} cursor-not-allowed text-gray-400`;
    } else if (item.active) {
        className = `${baseClass} bg-blue-50 text-blue-700`;
    } else {
        className = `${baseClass} text-gray-700 hover:bg-gray-100 hover:text-gray-950`;
    }

    const content = (
        <>
            <FontAwesomeIcon icon={item.icon} className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{item.label}</span>
        </>
    );

    if (item.disabled || !item.href) {
        return (
            <span className={className} aria-disabled="true">
                {content}
            </span>
        );
    }

    return (
        <Link href={item.href} className={className} onClick={onClick}>
            {content}
        </Link>
    );
}

/** User initials dropdown (MYDS-style avatar circle with dropdown). */
function UserDropdown({ user, onLogout }: { user: AuthUser; onLogout: (e: FormEvent<HTMLFormElement>) => void }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside.
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const initials = getInitials(user.name);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 py-1 pl-1 pr-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-950"
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="Menu pengguna"
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                    {initials}
                </span>
                <FontAwesomeIcon icon={faChevronDown} className="h-2.5 w-2.5 text-gray-500" aria-hidden="true" />
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-3">
                        <p className="truncate text-sm font-medium text-gray-950">{user.name}</p>
                        <p className="truncate text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="px-1 py-1">
                        <form onSubmit={(e) => { onLogout(e); setOpen(false); }}>
                            <button
                                type="submit"
                                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-gray-950"
                            >
                                <FontAwesomeIcon icon={faRightFromBracket} className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>Keluar</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AuthenticatedLayout({ children, title, selectedProject = null }: AuthenticatedLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { props, url } = usePage<PageProps>();
    const user = props.auth?.user ?? null;

    const navigationItems: NavigationItem[] = [
        {
            label: 'Dashboard',
            href: '/',
            active: url === '/',
            icon: faHouse,
        },
        {
            label: 'Projects',
            href: '/projects',
            active: url.startsWith('/projects'),
            icon: faFolderOpen,
        },
    ];

    if (selectedProject?.dashboardUrl) {
        navigationItems.push({
            label: selectedProject.name,
            href: selectedProject.dashboardUrl,
            active: url === selectedProject.dashboardUrl,
            icon: faTableColumns,
        });
    }

    function handleLogout(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.post('/logout');
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-950">
            {/* Header — MYDS navbar pattern */}
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* Left: brand + desktop navigation */}
                        <div className="flex h-full min-w-0 items-center gap-6">
                            <AppBrand compact />

                            <nav className="app-shell-desktop-nav h-full items-center gap-0.5" aria-label="Primary navigation">
                                {navigationItems.map((item) => (
                                    <DesktopNavItem key={item.label} item={item} />
                                ))}
                            </nav>
                        </div>

                        {/* Right: user dropdown (desktop) */}
                        <div className="app-shell-desktop-actions items-center gap-3">
                            {user && <UserDropdown user={user} onLogout={handleLogout} />}
                        </div>

                        {/* Mobile hamburger toggle */}
                        <button
                            type="button"
                            className="app-shell-mobile-toggle h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-700 transition hover:bg-gray-100 hover:text-gray-950"
                            aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-navigation"
                            onClick={() => setMobileMenuOpen((open) => !open)}
                        >
                            <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Mobile menu panel */}
                {mobileMenuOpen && (
                    <div id="mobile-navigation" className="app-shell-mobile-panel border-t border-gray-200 bg-white">
                        <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 sm:px-6">
                            <nav className="space-y-1" aria-label="Mobile navigation">
                                {navigationItems.map((item) => (
                                    <MobileNavItem key={item.label} item={item} onClick={() => setMobileMenuOpen(false)} />
                                ))}
                            </nav>

                            <div className="border-t border-gray-200 pt-3">
                                {user && (
                                    <div className="mb-3 min-w-0">
                                        <p className="truncate text-sm font-medium leading-5 text-gray-950">{user.name}</p>
                                        <p className="truncate text-xs leading-5 text-gray-500">{user.email}</p>
                                    </div>
                                )}

                                <form onSubmit={handleLogout}>
                                    <button
                                        type="submit"
                                        className="flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-950"
                                    >
                                        <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" aria-hidden="true" />
                                        <span>Keluar</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main content */}
            <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {title && (
                    <div className="mb-5">
                        <h1 className="text-xl font-semibold leading-8 text-gray-950">{title}</h1>
                    </div>
                )}

                {children}
            </main>
        </div>
    );
}
