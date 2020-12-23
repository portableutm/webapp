/* istanbul ignore file */

export function createLeafletPolylineStore() {
	return {
		leafletPolyline: null,
		setPolyline(polyline) {
			this.leafletPolyline = polyline;
		},
		get isPolylineInstanced() {
			return this.leafletPolyline !== null;
		}
	};
}