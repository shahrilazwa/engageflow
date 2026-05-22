import { Head, useForm } from '@inertiajs/react';
import AppBrand from '@/Components/AppBrand';
import AuthCard from '@/Components/AuthCard';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function handleSubmit(event) {
        event.preventDefault();
        post('/login', { preserveScroll: true });
    }

    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen bg-gray-50 text-gray-950">
                <header className="border-b border-gray-200 bg-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                        <AppBrand compact />
                        <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                            Engagement workspace
                        </span>
                    </div>
                </header>

                <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
                    <AuthCard>
                        <div className="mb-8 flex justify-center">
                            <AppBrand />
                        </div>

                        <div className="mb-8 text-center">
                            <p className="text-sm font-medium text-blue-700">Secure workspace</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950">
                                Log in to EngageFlow
                            </h1>
                            <p className="mx-auto mt-3 max-w-sm text-base leading-7 text-gray-600">
                                Manage ministry and agency engagement progress from one workspace.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-800">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(event) => setData('email', event.target.value)}
                                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    placeholder="name@example.gov.my"
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-800">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(event) => setData('password', event.target.value)}
                                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    placeholder="Enter your password"
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>

                            <PrimaryButton processing={processing}>
                                {processing ? 'Logging in...' : 'Log in'}
                            </PrimaryButton>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-500">
                            User accounts are managed by EngageFlow administrators.
                        </p>
                    </AuthCard>
                </main>
            </div>
        </>
    );
}
