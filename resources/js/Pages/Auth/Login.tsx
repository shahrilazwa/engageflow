import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AppBrand from '@/Components/AppBrand';
import AuthCard from '@/Components/AuthCard';
import GovMasthead from '@/Components/GovMasthead';
import InputError from '@/Components/InputError';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

export default function Login() {
    const { data, setData, post, processing, errors } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post('/login', { preserveScroll: true });
    }

    const emailErrorId = errors.email ? 'email-error' : undefined;
    const passwordErrorId = errors.password ? 'password-error' : undefined;
    const inputClassName =
        'h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm leading-5 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100';

    return (
        <>
            <Head title="Log Masuk" />

            <div className="min-h-screen bg-gray-50 text-gray-950">
                <GovMasthead />

                <header className="border-b border-gray-200 bg-white">
                    <div className="mx-auto flex min-h-16 max-w-6xl items-center px-4 py-3 sm:px-6 lg:px-8">
                        <AppBrand compact />
                    </div>
                </header>

                <main className="mx-auto flex w-full max-w-6xl justify-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                    <section className="flex w-full justify-center">
                        <AuthCard>
                            <div className="mb-6">
                                <p className="text-sm font-medium leading-5 text-blue-700">EngageFlow</p>
                                <h2 className="mt-1 text-2xl font-semibold leading-8 text-gray-950">Log masuk</h2>
                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    Gunakan e-mel dan kata laluan kerja anda.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                <div>
                                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium leading-5 text-gray-700">
                                        E-mel
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="username"
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                        className={inputClassName}
                                        placeholder="nama@agensi.gov.my"
                                        aria-invalid={Boolean(errors.email)}
                                        aria-describedby={emailErrorId}
                                        disabled={processing}
                                        required
                                    />
                                    <InputError id="email-error" message={errors.email} />
                                </div>

                                <div>
                                    <label htmlFor="password" className="mb-1.5 block text-sm font-medium leading-5 text-gray-700">
                                        Kata laluan
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(event) => setData('password', event.target.value)}
                                        className={inputClassName}
                                        placeholder="Masukkan kata laluan"
                                        aria-invalid={Boolean(errors.password)}
                                        aria-describedby={passwordErrorId}
                                        disabled={processing}
                                        required
                                    />
                                    <InputError id="password-error" message={errors.password} />
                                </div>

                                <label className="flex items-center gap-3 text-sm leading-5 text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(event) => setData('remember', event.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
                                        disabled={processing}
                                    />
                                    <span>Ingat sesi log masuk</span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="auth-submit-button mt-2 flex h-11 w-full items-center justify-center rounded-md border px-4 text-sm font-semibold leading-5 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Sedang log masuk...' : 'Log Masuk'}
                                </button>
                            </form>
                        </AuthCard>
                    </section>
                </main>
            </div>
        </>
    );
}
