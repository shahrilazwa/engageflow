export default function AuthCard({ children }) {
    return (
        <section className="w-full max-w-[420px] rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            {children}
        </section>
    );
}
