import { useState } from 'react';

export default function GovMasthead() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <button
                    type="button"
                    onClick={() => setIsOpen((current) => !current)}
                    className="flex h-11 items-center gap-2 text-sm font-medium leading-5 text-gray-950 hover:text-gray-800"
                    aria-expanded={isOpen}
                >
                    <span className="text-xs font-semibold" aria-hidden="true">MY</span>
                    <span>Portal Rasmi Kerajaan Malaysia</span>
                    <span className="text-blue-700">Ketahui Lebih Lanjut</span>
                    <span className="text-blue-700" aria-hidden="true">{isOpen ? '⌃' : '⌄'}</span>
                </button>

                {isOpen && (
                    <div className="pb-6">
                        <div className="grid gap-8 rounded-xl bg-gray-100 px-8 py-7 md:grid-cols-2 lg:px-10">
                            <div className="flex gap-5">
                                <div className="mt-1 text-gray-500" aria-hidden="true">⌂</div>
                                <div>
                                    <h2 className="text-base font-semibold leading-6 text-gray-950">
                                        Pautan portal rasmi berakhir dengan .gov.my
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-gray-600">
                                        Sekiranya pautan tidak berakhir dengan .gov.my, sila keluar dari laman web dengan segera walaupun ia kelihatan serupa.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-5">
                                <div className="mt-1 text-gray-500" aria-hidden="true">🔒</div>
                                <div>
                                    <h2 className="text-base font-semibold leading-6 text-gray-950">
                                        Portal yang selamat menggunakan HTTPS
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-gray-600">
                                        Periksa ikon kunci atau https:// di depan pautan. Jika tiada, jangan kongsi sebarang maklumat sensitif.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
