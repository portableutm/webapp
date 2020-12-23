/* istanbul ignore file */

export function createLeafletMarkerStore() {
	return {
		leafletMarker: null,
		tooltipClass: '',
		setMarker(marker) {
			this.leafletMarker = marker;
			if (this.tooltipClass !== '') {
				this.leafletMarker.bindTooltip(
					'',
					{
						direction: 'center',
						permanent: true,
						interactive: true,
						className: this.tooltipClass
					});
			}

		},
		setInfoText(text) {
			this.leafletMarker
				.setTooltipContent(text)
				.openTooltip();
		},
		setTooltipClass(classname) {
			this.tooltipClass = classname;
		},
		get isMarkerInstanced() {
			return this.leafletMarker !== null;
		}
	};
}