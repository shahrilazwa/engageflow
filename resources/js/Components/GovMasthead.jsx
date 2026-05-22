import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faLock } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import MalaysiaFlag from '@/Components/MalaysiaFlag';

function OutlineBuildingIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-[22px] w-[22px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M4 21h16" />
            <path d="M6 21V8" />
            <path d="M18 21V8" />
            <path d="M8 21v-4h8v4" />
            <path d="M8 8V4h8v4" />
            <path d="M6 8h12" />
            <path d="M9 11h1" />
            <path d="M14 11h1" />
            <path d="M9 14h1" />
            <path d="M14 14h1" />
        </svg>
    );
}

function OutlineLockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="h-[22px] w-[22px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
    );
}

export default function GovMasthead() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={() => setIsOpen((current) => !current)}
                    className="inline-flex h-9 max-w-full items-center gap-1.5 overflow-hidden text-xs font-medium leading-[18px] text-gray-950 hover:text-gray-800 sm:gap-2"
                    aria-expanded={isOpen}
                    aria-controls="gov-masthead-panel"
                >
                    <MalaysiaFlag />
                    <span className="shrink-0 whitespace-nowrap">Portal Rasmi</span>
                    <span className="shrink-0 whitespace-nowrap text-blue-700">Ketahui Lanjut</span>
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
                                <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-2.5 sm:gap-3">
                                    <span className="flex h-7 w-7 shrink-0 items-start justify-center pt-[1px] text-gray-500">
                                        <OutlineBuildingIcon />
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

                                <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-2.5 sm:gap-3">
                                    <span className="flex h-7 w-7 shrink-0 items-start justify-center pt-[1px] text-gray-500">
                                        <OutlineLockIcon />
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
