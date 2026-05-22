export default function AuthInfoBand() {
    return (
        <section className="bg-white px-6 py-8">
            <div className="mx-auto grid max-w-7xl gap-6 rounded-3xl bg-gray-100 px-8 py-7 md:grid-cols-2 md:px-10">
                <div className="flex gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm">
                        <span className="text-lg font-bold">1</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-950">Clear engagement progress</h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
                            View agency owners, services and workflow stages from one workspace.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm">
                        <span className="text-lg font-bold">2</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-950">Structured GovTech delivery</h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
                            Use simple status views to spot delayed services and overdue follow-ups.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
