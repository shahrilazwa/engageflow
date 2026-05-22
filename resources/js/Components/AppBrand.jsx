export default function AppBrand({ compact = false }) {
    const logoSize = compact ? 'h-8 w-8 text-sm' : 'h-10 w-10 text-base';
    const titleSize = compact ? 'text-base' : 'text-lg';
    const subtitleSize = compact ? 'text-xs' : 'text-sm';

    return (
        <div className="flex items-center gap-3">
            <div
                className={`${logoSize} flex shrink-0 items-center justify-center rounded-xl bg-blue-600 font-semibold text-white shadow-sm shadow-blue-200`}
                aria-hidden="true"
            >
                E
            </div>
            <div className="leading-tight">
                <p className={`${titleSize} font-semibold text-gray-950`}>EngageFlow</p>
                <p className={`${subtitleSize} text-gray-500`}>GovTech engagement tracker</p>
            </div>
        </div>
    );
}
