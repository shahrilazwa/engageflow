export default function MalaysiaFlag() {
    return (
        <span
            className="relative inline-block h-[14px] w-[28px] overflow-hidden rounded-[2px] border border-gray-200 bg-white shadow-sm"
            aria-label="Malaysia"
            role="img"
        >
            <span className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,#d0021b_0,#d0021b_1px,#ffffff_1px,#ffffff_2px)]" />
            <span className="absolute left-0 top-0 h-[8px] w-[12px] bg-blue-800" />
            <span className="absolute left-[3px] top-[2px] h-[5px] w-[5px] rounded-full bg-yellow-400" />
            <span className="absolute left-[5px] top-[2px] h-[5px] w-[5px] rounded-full bg-blue-800" />
            <span className="absolute left-[9px] top-[3px] h-[2px] w-[2px] rounded-full bg-yellow-400" />
        </span>
    );
}
