import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@govtechmy/myds-react/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import type { FormEvent } from 'react';

type CreateForm = {
    name: string;
    description: string;
};

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<CreateForm>({
        name: '',
        description: '',
    });

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post('/projects');
    }

    const inputClassName =
        'h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm leading-5 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100';

    return (
        <AuthenticatedLayout title="New Project">
            <Head title="New Project" />

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
                                placeholder="e.g. GovTech Libat Urus Q1"
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
                                placeholder="Brief description of this project"
                                disabled={processing}
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Link href="/projects">
                                <Button type="button" variant="default-outline" size="small">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" variant="primary-fill" size="small" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Project'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
