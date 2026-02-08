export function toggle(setter: React.Dispatch<React.SetStateAction<Set<string>>>, key: string) {
    setter((prev: Set<string>) => {
        const next = new Set(prev);
        if (next.has(key)) {
        next.delete(key);
        } else {
        next.add(key);
        }
        return next;
    });
}