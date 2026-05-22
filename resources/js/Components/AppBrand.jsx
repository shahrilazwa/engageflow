export default function AppBrand({ compact = false }) {
    const logoSize = compact ? 'h-9 w-9 text-sm' : 'h-10 w-10 text-sm';
    const titleSize = compact ? 'text-base leading-6' : 'text-lg leading-7';

    return (
        <div className="flex items-center gap-3">
            <div
                className={`${logoSize} flex shrink-0 items-center justify-center rounded-xl bg-blue-600 font-semibold text-white shadow-sm shadow-blue-200`}
                aria-hidden="true"
            >
                E
            </div>
            <p className={`${titleSize} font-semibold tracking-tight text-gray-950`}>EngageFlow</p>
        </div>
    );
}
