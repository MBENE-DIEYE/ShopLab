const Stelle = ({ rating, size = "h-3.5 w-3.5" }) => {
    const piene = Math.round(rating?.rate ?? 0);
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} viewBox="0 0 20 20" className={`${size} ${i < piene ? "fill-amber-400" : "fill-gray-200"}`}>
                    <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.9l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85z" />
                </svg>
            ))}
            <span className="text-xs text-gray-400 ml-1">({rating?.count ?? 0})</span>
        </div>
    )
}
export default Stelle;
