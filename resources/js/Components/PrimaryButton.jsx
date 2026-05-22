export default function PrimaryButton({ children, processing = false }) {
    return (
        <button
            type="submit"
            disabled={processing}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {children}
        </button>
    );
}
