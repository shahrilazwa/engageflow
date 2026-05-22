import { Head, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import AppBrand from '@/Components/AppBrand';
import AuthCard from '@/Components/AuthCard';
import GovMasthead from '@/Components/GovMasthead';
import InputError from '@/Components/InputError';

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
            <Head title="Log Masuk" />

            <div className="min-h-screen bg-white text-gray-950">
                <GovMasthead />

                <header className="border-b border-gray-200 bg-white">
                    <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                        <AppBrand compact />
                        <div className="flex items-center gap-5 text-sm font-medium leading-5 text-gray-700">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faGlobe} className="h-4 w-4 text-gray-950" aria-hidden="true" />
                                <span>BM</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-6 py-7 lg:px-8">
                    <div className="grid gap-14 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:items-start">
                        <section className="max-w-xl pt-1">
                            <div className="mb-5">
                                <h1 className="text-[28px] font-semibold leading-9 tracking-tight text-gray-950">
                                    Jejak tugas, status dan tarikh akhir dalam satu paparan.
                                </h1>
                                <p className="mt-3 text-base leading-7 text-gray-600">
                                    Ruang kerja bersama untuk pasukan mengurus tindakan, memantau kemajuan dan kekal selaras merentas pelbagai aliran kerja.
                                </p>
                            </div>

                            <img
                                src="/images/login-illustration.webp"
                                alt="Ilustrasi pemantauan tugas, status dan kemajuan kerja"
                                className="w-full max-w-[560px] rounded-2xl object-contain"
                            />
                        </section>

                        <section className="flex justify-center lg:justify-start">
                            <AuthCard>
                                <div className="mb-4 text-center">
                                    <h2 className="text-[22px] font-semibold leading-8 tracking-tight text-gray-950">
                                        Log masuk ke EngageFlow
                                    </h2>
                                    <p className="mt-1.5 text-sm leading-5 text-gray-500">
                                        Masukkan nama pengguna dan kata laluan anda.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium leading-5 text-gray-700">
                                            Nama pengguna
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            autoComplete="username"
                                            value={data.email}
                                            onChange={(event) => setData('email', event.target.value)}
                                            className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm leading-5 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            placeholder="Masukkan nama pengguna"
                                            required
                                        />
                                        <InputError message={errors.email} />
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
                                            className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm leading-5 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            placeholder="Masukkan kata laluan"
                                            required
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="mt-2 flex h-11 w-full items-center justify-center rounded-md px-4 text-sm font-semibold leading-5 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                        style={{
                                            backgroundColor: processing ? '#93c5fd' : '#2563eb',
                                            border: '1px solid #2563eb',
                                            color: '#ffffff',
                                        }}
                                    >
                                        {processing ? 'Sedang log masuk...' : 'Log Masuk'}
                                    </button>
                                </form>
                            </AuthCard>
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}
