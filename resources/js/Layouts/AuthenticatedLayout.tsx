import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@govtechmy/myds-react/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faFolderOpen, faHouse, faRightFromBracket, faTableColumns, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState, type FormEvent, type ReactNode } from 'react';
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

function navigationItemClass(active: boolean, disabled?: boolean): string {
    const baseClass = 'inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition';

    if (disabled) {
        return `${baseClass} cursor-not-allowed text-gray-400`;
    }

    if (active) {
        return `${baseClass} bg-blue-50 text-blue-700`;
    }

    return `${baseClass} text-gray-600 hover:bg-gray-100 hover:text-gray-950`;
}

function mobileNavigationItemClass(active: boolean, disabled?: boolean): string {
    const baseClass = 'flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition';

    if (disabled) {
        return `${baseClass} cursor-not-allowed text-gray-400`;
    }

    if (active) {
        return `${baseClass} bg-blue-50 text-blue-700`;
    }

    return `${baseClass} text-gray-700 hover:bg-gray-100 hover:text-gray-950`;
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
            active: url.startsWith('/projects'),
            disabled: true,
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

    function renderNavigationItem(item: NavigationItem, mobile = false) {
        const className = mobile ? mobileNavigationItemClass(item.active, item.disabled) : navigationItemClass(item.active, item.disabled);
        const content = (
            <>
                <FontAwesomeIcon icon={item.icon} className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
            </>
        );

        if (item.disabled || !item.href) {
            return (
                <span key={item.label} className={className} aria-disabled="true">
                    {content}
                </span>
            );
        }

        return (
            <Link key={item.label} href={item.href} className={className} onClick={() => setMobileMenuOpen(false)}>
                {content}
            </Link>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-950">
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex min-h-16 items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-6">
                            <AppBrand compact />

                            <nav className="app-shell-desktop-nav items-center gap-1" aria-label="Primary navigation">
                                {navigationItems.map((item) => renderNavigationItem(item))}
                            </nav>
                        </div>

                        <div className="app-shell-desktop-actions min-w-0 items-center gap-4">
                            {user && (
                                <div className="min-w-0 text-right">
                                    <p className="truncate text-sm font-medium leading-5 text-gray-950">{user.name}</p>
                                    <p className="truncate text-xs leading-5 text-gray-500">{user.email}</p>
                                </div>
                            )}

                            <form onSubmit={handleLogout}>
                                <Button type="submit" variant="default-ghost" size="small">
                                    <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" aria-hidden="true" />
                                    <span>Keluar</span>
                                </Button>
                            </form>
                        </div>

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

                {mobileMenuOpen && (
                    <div id="mobile-navigation" className="app-shell-mobile-panel border-t border-gray-200 bg-white">
                        <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 sm:px-6">
                            <nav className="space-y-1" aria-label="Mobile navigation">
                                {navigationItems.map((item) => renderNavigationItem(item, true))}
                            </nav>

                            <div className="border-t border-gray-200 pt-3">
                                {user && (
                                    <div className="mb-3 min-w-0">
                                        <p className="truncate text-sm font-medium leading-5 text-gray-950">{user.name}</p>
                                        <p className="truncate text-xs leading-5 text-gray-500">{user.email}</p>
                                    </div>
                                )}

                                <form onSubmit={handleLogout}>
                                    <Button type="submit" variant="default-outline" size="small">
                                        <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" aria-hidden="true" />
                                        <span>Keluar</span>
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </header>

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
