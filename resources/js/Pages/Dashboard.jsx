import { Head, router } from '@inertiajs/react';

/**
 * Dashboard - minimal authenticated placeholder.
 * Full dashboard UI will be built in a later task.
 */
export default function Dashboard({ auth }) {
    function handleLogout(e) {
        e.preventDefault();
        router.post('/logout');
    }

    return (
        <>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gray-50">
                <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                    <span className="text-lg font-semibold text-gray-900">EngageFlow</span>
                    <div className="flex items-center gap-4">
                        {auth?.user && (
                            <span className="text-sm text-gray-500">{auth.user.name}</span>
                        )}
                        <form onSubmit={handleLogout}>
                            <button
                                type="submit"
                                className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                            >
                                Sign out
                            </button>
                        </form>
                    </div>
                </header>

                <main className="px-6 py-12 text-center">
                    <h2 className="mb-2 text-xl font-medium text-gray-900">Dashboard</h2>
                    <p className="text-sm text-gray-500">
                        Project tracking features will appear here in a later task.
                    </p>
                </main>
            </div>
        </>
    );
}
