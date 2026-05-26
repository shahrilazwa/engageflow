import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@govtechmy/myds-react/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import type { FormEvent } from 'react';

type Project = {
    id: number;
    name: string;
    description: string | null;
};

type EditForm = {
    name: string;
    description: string;
};

type Props = {
    project: Project;
};

export default function Edit({ project }: Props) {
    const { data, setData, put, processing, errors } = useForm<EditForm>({
        name: project.name,
        description: project.description ?? '',
    });

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        put(`/projects/${project.id}`);
    }

    function handleDelete() {
        if (confirm('Are you sure you want to delete this project? This action can be undone later.')) {
            router.delete(`/projects/${project.id}`);
        }
    }

    const inputClassName =
        'h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm leading-5 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100';

    return (
        <AuthenticatedLayout title="Edit Project">
            <Head title="Edit Project" />

            <div className="mx-auto max-w-lg">
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div>
                            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Project name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={inputClassName}
                                disabled={processing}
                                required
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div>
                            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Description <span className="text-gray-400">(optional)</span>
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className={`${inputClassName} h-24 resize-none py-2.5`}
                                disabled={processing}
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2">
                            <Button type="button" variant="danger-fill" size="small" onClick={handleDelete}>
                                Delete
                            </Button>

                            <div className="flex items-center gap-3">
                                <Link href={`/projects/${project.id}`}>
                                    <Button type="button" variant="default-outline" size="small">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" variant="primary-fill" size="small" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
