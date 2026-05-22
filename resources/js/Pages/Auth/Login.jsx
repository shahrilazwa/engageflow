import { Head, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faGlobe, faUserShield } from '@fortawesome/free-solid-svg-icons';
import AppBrand from '@/Components/AppBrand';
import AuthCard from '@/Components/AuthCard';
import GovMasthead from '@/Components/GovMasthead';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

const guidanceItems = [
    'Pantau status engagement kementerian dan agensi secara berstruktur.',
    'Semak peringkat kerja, tindakan susulan dan status kelewatan dengan lebih jelas.',
    'Akaun pengguna dicipta dan diuruskan oleh pentadbir EngageFlow.',
];

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
                            <button
                                type="button"
                                className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold leading-5 text-white shadow-sm hover:bg-blue-700"
                            >
                                Log Masuk
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                    <div className="grid gap-14 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:items-start">
                        <section className="max-w-md pt-1">
                            <p className="text-sm leading-5 text-gray-500">EngageFlow</p>
                            <h1 className="mt-3 text-[28px] font-semibold leading-9 tracking-tight text-gray-950">Log Masuk</h1>
                            <p className="mt-3 text-base leading-7 text-gray-600">
                                Masukkan kelayakan anda untuk mengakses ruang kerja pemantauan engagement GovTech.
                            </p>

                            <div className="mt-8 space-y-4 border-l-2 border-blue-100 pl-5">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                                        <FontAwesomeIcon icon={faUserShield} className="h-4 w-4" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-semibold leading-5 text-gray-950">Ruang kerja dalaman</h2>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">
                                            Akses terhad kepada pegawai yang mempunyai akaun EngageFlow.
                                        </p>
                                    </div>
                                </div>

                                <ul className="space-y-3">
                                    {guidanceItems.map((item) => (
                                        <li key={item} className="flex gap-3 text-sm leading-6 text-gray-600">
                                            <FontAwesomeIcon
                                                icon={faCircleCheck}
                                                className="mt-1 h-4 w-4 shrink-0 text-blue-600"
                                                aria-hidden="true"
                                            />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <section className="flex justify-center lg:justify-start">
                            <AuthCard>
                                <div className="mb-5 text-center">
                                    <h2 className="text-[22px] font-semibold leading-8 tracking-tight text-gray-950">
                                        Log masuk ke EngageFlow
                                    </h2>
                                    <p className="mt-1.5 text-sm leading-5 text-gray-500">
                                        Sila masukkan butiran akaun anda.
                                    </p>
                                </div>

                                <div className="mb-5 flex rounded-lg border border-gray-200 bg-gray-50 p-1 text-sm font-semibold leading-5 text-gray-600">
                                    <span className="flex-1 rounded-md bg-white px-3 py-2.5 text-center text-blue-700 shadow-sm">
                                        Kata Laluan
                                    </span>
                                    <span className="flex-1 px-3 py-2.5 text-center text-gray-400">
                                        E-mel
                                    </span>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="mb-1.5 block text-sm font-medium leading-5 text-gray-700">
                                            E-mel Kerajaan
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(event) => setData('email', event.target.value)}
                                            className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm leading-5 text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            placeholder="nama@agensi.gov.my"
                                            required
                                        />
                                        <p className="mt-1.5 text-xs leading-[18px] text-gray-500">Mesti berakhir dengan .gov.my</p>
                                        <InputError message={errors.email} />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="mb-1.5 block text-sm font-medium leading-5 text-gray-700">
                                            Kata Laluan
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

                                    <PrimaryButton processing={processing}>
                                        {processing ? 'Sedang log masuk...' : 'Log Masuk'}
                                    </PrimaryButton>
                                </form>
                            </AuthCard>
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}
