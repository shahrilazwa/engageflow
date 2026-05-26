import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

type Project = {
    id: number;
    name: string;
    description: string | null;
    status: string;
    updated_at: string;
};

type Props = {
    project: Project;
};

/**
 * Project show page — placeholder Project dashboard.
 * Full dashboard with workflow builder link, tasks, and progress
 * will be built in later MVP slices.
 */
export default function Show({ project }: Props) {
    return (
        <AuthenticatedLayout title={project.name}>
            <Head title={project.name} />

            <div className="space-y-4">
                {/* Project header with edit link */}
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        {project.description && (
                            <p className="text-sm text-gray-500">{project.description}</p>
                        )}
                    </div>
                    <Link
                        href={`/projects/${project.id}/edit`}
                        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-950"
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Edit</span>
                    </Link>
                </div>

                {/* Placeholder content */}
                <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                    <p className="text-sm text-gray-500">
                        Project dashboard, workflow builder, and tasks will appear here in later MVP slices.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
