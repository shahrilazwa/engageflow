import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard() {
    return (
        <AuthenticatedLayout title="Dashboard">
            <Head title="Dashboard" />

            <section className="max-w-xl border border-dashed border-gray-300 bg-white px-5 py-8 text-center sm:px-6">
                <h2 className="text-base font-semibold leading-6 text-gray-950">No project selected</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                    Project dashboards will appear here after a project is selected.
                </p>
            </section>
        </AuthenticatedLayout>
    );
}
