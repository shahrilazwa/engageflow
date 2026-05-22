export default function AuthCard({ children }) {
    return (
        <section className="w-full max-w-[460px] rounded-2xl border border-gray-200 bg-white p-10 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
            {children}
        </section>
    );
}
