import {fM} from '../../libs/SaferSanctuary';

export function createLeafletPolygonStore(source) {
	return {
		leafletPolygon: null,
		infoName: '',
		infoText: '',
		patternIsUsed: false,
		patternAngle: 45,
		patternStrokeColor: '#ffffff',
		patternStrokeWidth: '15',
		tooltipClass: '',
		setPolygon(polygon) {
			if (this.patternIsUsed) {
				const nameNoSpaces = this.infoName.replace(/\s/g, '');
				const pattern = document.createElementNS(
					'http://www.w3.org/2000/svg', 'pattern');
				pattern.setAttribute('id', 'pattern' + nameNoSpaces);
				pattern.setAttribute('patternUnits', 'userSpaceOnUse');
				pattern.setAttribute('width', '28.5');
				pattern.setAttribute('height', '28.5');
				pattern.setAttribute('patternTransform', 'rotate(' + this.patternAngle + ')');

				const line = document.createElementNS(
					'http://www.w3.org/2000/svg', 'line');
				line.setAttribute('x1', '0');
				line.setAttribute('y1', '0');
				line.setAttribute('x2', '0');
				line.setAttribute('y2', '28.5');
				line.setAttribute('stroke', this.patternStrokeColor);
				line.setAttribute('stroke-width', this.patternStrokeWidth);
				pattern.appendChild(line);

				const ovp = source.map.getPanes().overlayPane.firstChild;
				if (ovp) {
					const defs = ovp.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
					defs.appendChild(pattern);
					ovp.insertBefore(defs, ovp.firstChild);
				}

				polygon._path.setAttribute('id', nameNoSpaces);
				polygon._path.setAttribute('fill', 'url(#pattern' + nameNoSpaces + ')');

				polygon.bindTooltip(
					this.infoText,
					{
						direction: 'center',
						permanent: true,
						interactive: true,
						className: this.tooltipClass
					}
				).openTooltip();
			}
			this.leafletPolygon = polygon;
		},
		setPattern(angle, strokeColor, strokeWidth) {
			this.patternIsUsed = true;
			this.patternAngle = angle;
			this.patternStrokeColor = strokeColor;
			this.patternStrokeWidth = strokeWidth;
		},
		setInfo(name, text, tooltipClass) {
			this.infoName = name;
			this.infoText = text;
			this.tooltipClass = tooltipClass;
		},
		get isPolygonInstanced() {
			return this.leafletPolygon !== null;
		}
	};
}
