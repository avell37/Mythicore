export function normalizeRegion(region: string): string {
	return region.trim().toLowerCase();
}

export function normalizeRealm(realm: string): string {
	return realm.trim().toLowerCase().replace(/['’]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

export function normalizeName(name: string): string {
	return name.trim().toLowerCase();
}
