export default function MalaysiaFlag() {
    return (
        <svg
            viewBox="0 0 28 18"
            className="h-[14px] w-[22px] shrink-0 rounded-[2px] shadow-sm ring-1 ring-gray-200"
            aria-label="Malaysia"
            role="img"
        >
            <rect width="28" height="18" fill="#fff" />
            {Array.from({ length: 7 }).map((_, index) => (
                <rect key={index} x="0" y={index * 18 / 7} width="28" height={18 / 14} fill="#cc0001" />
            ))}
            <rect width="12" height="9" fill="#010066" />
            <circle cx="5" cy="4.5" r="3.1" fill="#ffcc00" />
            <circle cx="6.2" cy="4.5" r="2.7" fill="#010066" />
            <polygon
                points="9.2,2.1 9.55,3.5 10.65,2.55 9.95,3.82 11.4,3.72 10.05,4.25 11.15,5.2 9.75,4.85 9.95,6.3 9.2,5.05 8.45,6.3 8.65,4.85 7.25,5.2 8.35,4.25 7,3.72 8.45,3.82 7.75,2.55 8.85,3.5"
                fill="#ffcc00"
            />
        </svg>
    );
}
