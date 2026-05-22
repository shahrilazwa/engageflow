import { Head, useForm } from '@inertiajs/react';
import AppBrand from '@/Components/AppBrand';
import AuthCard from '@/Components/AuthCard';
import GovMasthead from '@/Components/GovMasthead';
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
            <Head title="Log Masuk" />

            <div className="min-h-screen bg-white text-gray-950">
                <GovMasthead />

                <header className="border-b border-gray-200 bg-white">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                        <AppBrand compact />
                        <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
                            <span>BM</span>
                            <span className="hidden sm:inline">Open menu</span>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
                        <section className="max-w-md">
                            <p className="text-xs text-gray-500">EngageFlow</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950">Log Masuk</h1>
                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                Masukkan kelayakan anda untuk mengakses ruang kerja pemantauan engagement GovTech.
                            </p>
                        </section>

                        <section className="flex justify-center lg:justify-start">
                            <AuthCard>
                                <div className="mb-6 text-center">
                                    <h2 className="text-xl font-semibold tracking-tight text-gray-950">
                                        Log masuk ke EngageFlow
                                    </h2>
                                    <p className="mt-2 text-xs leading-5 text-gray-500">
                                        Sila masukkan butiran akaun anda.
                                    </p>
                                </div>

                                <div className="mb-5 flex rounded-md border border-gray-200 bg-gray-50 p-1 text-xs font-semibold text-gray-600">
                                    <span className="flex-1 rounded bg-white px-3 py-2 text-center text-blue-700 shadow-sm">
                                        Kata Laluan
                                    </span>
                                    <span className="flex-1 px-3 py-2 text-center text-gray-400">
                                        E-mel
                                    </span>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-gray-700">
                                            E-mel Kerajaan
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(event) => setData('email', event.target.value)}
                                            className="h-9 w-full rounded border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            placeholder="nama@agensi.gov.my"
                                            required
                                        />
                                        <p className="mt-1 text-[11px] text-gray-500">Mesti berakhir dengan .gov.my</p>
                                        <InputError message={errors.email} />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-gray-700">
                                            Kata Laluan
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(event) => setData('password', event.target.value)}
                                            className="h-9 w-full rounded border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            placeholder="Masukkan kata laluan"
                                            required
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <PrimaryButton processing={processing}>
                                        {processing ? 'Sedang log masuk...' : 'Log Masuk'}
                                    </PrimaryButton>
                                </form>

                                <p className="mt-5 text-center text-xs text-gray-500">
                                    Akaun pengguna diuruskan oleh pentadbir EngageFlow.
                                </p>
                            </AuthCard>
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}
