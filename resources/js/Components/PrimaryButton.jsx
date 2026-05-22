export default function PrimaryButton({ children }) {
    return (
        <button type="submit" className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700">
            {children}
        </button>
    );
}
