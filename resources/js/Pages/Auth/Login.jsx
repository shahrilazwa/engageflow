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
            <Head title="Login" />

            <main className="min-h-screen bg-white px-6 py-10 text-gray-950 lg:px-10">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-12 flex items-center justify-between">
                        <AppBrand compact />
                        <span className="text-xs text-gray-500">engageflow.jdn.gov.my</span>
                    </div>

                    <div className="grid gap-12 lg:grid-cols-[280px_1fr] lg:items-start">
                        <aside className="space-y-8">
                            <div>
                                <p className="mb-4 text-xs text-gray-500">Page → Login</p>
                                <h1 className="text-2xl font-semibold tracking-tight text-gray-950">Login</h1>
                                <p className="mt-3 text-sm leading-6 text-gray-600">
                                    Access the EngageFlow workspace to manage agency engagement progress and follow-up actions.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold text-gray-950">Login with email and password</h2>
                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                    A standard internal login for authorised users created by an administrator.
                                </p>
                            </div>

                            <ol className="space-y-3 text-xs leading-5 text-gray-600">
                                <li className="flex gap-3">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white">1</span>
                                    Enter the email address assigned to your EngageFlow account.
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white">2</span>
                                    Enter your password and continue to the protected workspace.
                                </li>
                                <li className="flex gap-3">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white">3</span>
                                    User accounts are created and managed by an administrator.
                                </li>
                            </ol>
                        </aside>

                        <section className="flex justify-center lg:justify-start lg:pl-16">
                            <AuthCard>
                                <div className="mb-6 text-center">
                                    <h2 className="text-xl font-semibold tracking-tight text-gray-950">
                                        Log in to EngageFlow
                                    </h2>
                                    <p className="mt-2 text-xs leading-5 text-gray-500">
                                        Welcome back. Please enter your details.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(event) => setData('email', event.target.value)}
                                            className="h-9 w-full rounded border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            placeholder="name@example.gov.my"
                                            required
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-gray-700">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(event) => setData('password', event.target.value)}
                                            className="h-9 w-full rounded border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <PrimaryButton processing={processing}>
                                        {processing ? 'Logging in...' : 'Log in'}
                                    </PrimaryButton>
                                </form>

                                <p className="mt-5 text-center text-xs text-gray-500">
                                    User accounts are managed by EngageFlow administrators.
                                </p>
                            </AuthCard>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}
