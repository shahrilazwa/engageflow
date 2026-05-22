export default function AuthCard({ children }) {
    return (
        <section className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 shadow-xl shadow-gray-200/70 sm:p-10">
            {children}
        </section>
    );
}
