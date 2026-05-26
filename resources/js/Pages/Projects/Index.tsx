import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faPlus } from '@fortawesome/free-solid-svg-icons';

type Project = {
    id: number;
    name: string;
    description: string | null;
    status: string;
    updated_at: string;
};

type Props = {
    projects: Project[];
};

export default function Index({ projects }: Props) {
    return (
        <AuthenticatedLayout title="Projects">
            <Head title="Projects" />

            <div className="space-y-4">
                {/* Header with create button */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {projects.length > 0
                            ? `${projects.length} project${projects.length !== 1 ? 's' : ''}`
                            : ''}
                    </p>
                    <Link
                        href="/projects/create"
                        className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                        <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>New Project</span>
                    </Link>
                </div>

                {/* Project list or empty state */}
                {projects.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                        <FontAwesomeIcon icon={faFolderOpen} className="mx-auto h-10 w-10 text-gray-300" aria-hidden="true" />
                        <h3 className="mt-3 text-sm font-medium text-gray-900">No projects yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Create your first project to start tracking work.</p>
                        <div className="mt-4">
                            <Link
                                href="/projects/create"
                                className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-3.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                            >
                                <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>New Project</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/projects/${project.id}`}
                                className="block rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-gray-300 hover:shadow-sm"
                            >
                                <h3 className="text-sm font-medium text-gray-950">{project.name}</h3>
                                {project.description && (
                                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">{project.description}</p>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
