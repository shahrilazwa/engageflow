export default function AppBrand({ compact = false }) {
    const logoSize = compact ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm';
    const titleSize = compact ? 'text-sm leading-5' : 'text-base leading-6';
    const subtitleSize = compact ? 'text-xs leading-[18px]' : 'text-sm leading-5';

    return (
        <div className="flex items-center gap-3">
            <div
                className={`${logoSize} flex shrink-0 items-center justify-center rounded-xl bg-blue-600 font-semibold text-white shadow-sm shadow-blue-200`}
                aria-hidden="true"
            >
                E
            </div>
            <div className="leading-tight">
                <p className={`${titleSize} font-heading font-semibold tracking-tight text-gray-950`}>EngageFlow</p>
                <p className={`${subtitleSize} text-gray-500`}>GovTech engagement tracker</p>
            </div>
        </div>
    );
}
