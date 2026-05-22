export default function AuthCard({ children }) {
    return (
        <section className="w-full max-w-[360px] rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            {children}
        </section>
    );
}
