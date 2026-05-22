import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faLandmark, faLock } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import MalaysiaFlag from '@/Components/MalaysiaFlag';

export default function GovMasthead() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <button
                    type="button"
                    onClick={() => setIsOpen((current) => !current)}
                    className="inline-flex h-11 items-center gap-2 text-sm font-medium leading-5 text-gray-950 hover:text-gray-800"
                    aria-expanded={isOpen}
                    aria-controls="gov-masthead-panel"
                >
                    <MalaysiaFlag />
                    <span>Portal Rasmi Kerajaan Malaysia</span>
                    <span className="text-blue-700">Ketahui Lebih Lanjut</span>
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className={
                            'mt-[1px] h-3 w-3 text-blue-700 transition-transform duration-300 ease-out ' +
                            (isOpen ? 'rotate-180' : 'rotate-0')
                        }
                        aria-hidden="true"
                    />
                </button>

                <div
                    id="gov-masthead-panel"
                    className={
                        'grid transition-[grid-template-rows] duration-300 ease-out ' +
                        (isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')
                    }
                >
                    <div className="min-h-0 overflow-hidden">
                        <div
                            className={
                                'pb-6 transition-opacity duration-200 ease-out ' +
                                (isOpen ? 'opacity-100' : 'opacity-0')
                            }
                        >
                            <div className="grid gap-8 rounded-xl bg-gray-100 px-8 py-7 md:grid-cols-2 lg:px-10">
                                <div className="flex gap-5">
                                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-gray-500">
                                        <FontAwesomeIcon icon={faLandmark} className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <h2 className="text-base font-semibold leading-6 text-gray-950">
                                            Laman web rasmi kerajaan berakhir dengan .gov.my
                                        </h2>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">
                                            Sekiranya pautan tidak berakhir dengan .gov.my, sila keluar dari laman web dengan segera walaupun ia kelihatan serupa.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-5">
                                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-gray-500">
                                        <FontAwesomeIcon icon={faLock} className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <h2 className="text-base font-semibold leading-6 text-gray-950">
                                            Laman web selamat menggunakan HTTPS
                                        </h2>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">
                                            Cari ikon kunci atau https:// sebagai langkah berjaga-jaga tambahan. Jika tiada, jangan kongsi sebarang maklumat sensitif.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
