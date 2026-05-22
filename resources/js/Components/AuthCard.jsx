export default function AuthCard({ children }) {
    return (
        <section className="w-full max-w-[420px] rounded-xl border border-gray-200 bg-white p-7 shadow-sm">
            {children}
        </section>
    );
}
