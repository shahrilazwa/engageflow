export default function AuthFeatureBand() {
    return (
        <section className="border-b border-gray-200 bg-white px-6 py-6">
            <div className="mx-auto grid max-w-7xl gap-8 rounded-2xl bg-gray-100 px-8 py-7 md:grid-cols-2 lg:px-10">
                <div className="flex gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm">
                        <span className="text-base font-bold">1</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight text-gray-950">Built for engagement tracking</h2>
                        <p className="mt-1.5 max-w-xl text-sm leading-6 text-gray-600">
                            EngageFlow helps teams monitor agency owners, services, workflow stages and follow-up actions from one place.
                        </p>
                    </div>
                </div>

                <div className="flex gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm">
                        <span className="text-base font-bold">2</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight text-gray-950">Clear, structured and officer-friendly workflow</h2>
                        <p className="mt-1.5 max-w-xl text-sm leading-6 text-gray-600">
                            Use simple screens to review progress, delayed services, document links and overdue follow-ups.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
