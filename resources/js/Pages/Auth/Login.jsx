import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppBrand from '@/Components/AppBrand';
import AuthCard from '@/Components/AuthCard';
import AuthFeatureBand from '@/Components/AuthFeatureBand';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Login() {
    const [showInfo, setShowInfo] = useState(false);
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

            <div className="min-h-screen bg-white text-gray-950">
                <header className="border-b border-gray-200 bg-white">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                        <AppBrand compact />
                        <button
                            type="button"
                            onClick={() => setShowInfo((current) => !current)}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-800"
                        >
                            Ketahui Lebih Lanjut
                            <span aria-hidden="true">{showInfo ? '⌃' : '⌄'}</span>
                        </button>
                    </div>
                </header>

                {showInfo && <AuthFeatureBand />}

                <section className="border-b border-gray-200 bg-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-950">EngageFlow</h1>
                        <span className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-900 shadow-sm">
                            Secure access
                        </span>
                    </div>
                </section>

                <main className="relative flex min-h-[540px] items-start justify-center overflow-hidden px-6 py-12">
                    <div
                        className="absolute inset-0"
                        aria-hidden="true"
                        style={{
                            backgroundImage: 'radial-gradient(#d7dce3 1px, transparent 1px)',
                            backgroundSize: '32px 32px',
                        }}
                    />
                    <div className="relative w-full max-w-[460px]">
                        <AuthCard>
                            <div className="mb-8 text-center">
                                <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                                    Log in to EngageFlow
                                </h2>
                                <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-gray-600">
                                    Welcome back. Manage ministry and agency engagement progress from one workspace.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-bold text-gray-800">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        placeholder="name@example.gov.my"
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div>
                                    <label htmlFor="password" className="mb-2 block text-sm font-bold text-gray-800">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(event) => setData('password', event.target.value)}
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                    </div>
                </main>
            </div>
        </>
    );
}
