import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faLandmark, faLock } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import MalaysiaFlag from '@/Components/MalaysiaFlag';

export default function GovMasthead() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={() => setIsOpen((current) => !current)}
                    className="inline-flex h-9 max-w-full items-center gap-1.5 overflow-hidden text-[11px] font-medium leading-4 text-gray-950 hover:text-gray-800 sm:gap-2 sm:text-xs sm:leading-[18px]"
                    aria-expanded={isOpen}
                    aria-controls="gov-masthead-panel"
                >
                    <MalaysiaFlag />
                    <span className="shrink-0 whitespace-nowrap">Portal Rasmi Kerajaan Malaysia</span>
                    <span className="shrink-0 whitespace-nowrap text-blue-700">Ketahui Lebih Lanjut</span>
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className={
                            'mt-px h-2.5 w-2.5 shrink-0 text-blue-700 transition-transform duration-300 ease-out ' +
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
                                'pb-4 transition-opacity duration-200 ease-out ' +
                                (isOpen ? 'opacity-100' : 'opacity-0')
                            }
                        >
                            <div className="grid gap-5 rounded-lg bg-gray-100 px-5 py-5 sm:gap-8 sm:px-7 md:grid-cols-2 lg:px-8">
                                <div className="flex gap-3 sm:gap-4">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-gray-500">
                                        <FontAwesomeIcon icon={faLandmark} className="h-4 w-4" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <h2 className="text-sm font-semibold leading-5 text-gray-950">
                                            Laman web rasmi kerajaan berakhir dengan .gov.my
                                        </h2>
                                        <p className="mt-1 text-xs leading-[18px] text-gray-600">
                                            Sekiranya pautan tidak berakhir dengan .gov.my, sila keluar dari laman web dengan segera walaupun ia kelihatan serupa.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 sm:gap-4">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-gray-500">
                                        <FontAwesomeIcon icon={faLock} className="h-4 w-4" aria-hidden="true" />
                                    </span>
                                    <div>
                                        <h2 className="text-sm font-semibold leading-5 text-gray-950">
                                            Laman web selamat menggunakan HTTPS
                                        </h2>
                                        <p className="mt-1 text-xs leading-[18px] text-gray-600">
                                            Cari ikon kunci (
                                            <FontAwesomeIcon
                                                icon={faLock}
                                                className="mx-0.5 inline h-3 w-3 align-[-1px] text-yellow-500"
                                                aria-label="kunci"
                                            />
                                            ) atau https:// sebagai langkah berjaga-jaga tambahan. Jika tiada, jangan kongsi sebarang maklumat sensitif.
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
