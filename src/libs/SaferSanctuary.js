import S from 'sanctuary';

/**
 * Returns value of maybe OR an empty array
 * @param maybe
 * @returns {Array}
 * @private
 */
function _(maybe) {
	return S.isJust(maybe) ? S.maybeToNullable(maybe) : [];
}

/**
 * mapValues(maybeMap)(fnEmpty)(fnNonEmpty)
 * ::: If maybeMap is Just, fnNonEmpty gets called as an argument of Map.
 * ::: If Nothing, fnEmpty gets called.
 * @param maybeMap
 * @returns {*}
 */
function mapValues(maybeMap) {
	return S.isJust(maybeMap) ?
		(/*fnEmpty*/) =>
			(fnNonEmpty) =>
				S.values(S.maybeToNullable(maybeMap)).map(fnNonEmpty)
		: (fnEmpty) =>
			(/*fnNonEmpty*/) =>
				fnEmpty();
}

function maybeShow /* istanbul ignore next */ (maybe) {
	return S.isJust(maybe) ?
		(/*fnNothing*/) =>
			(fnJust) =>
				fnJust()
		:
		(fnNothing) =>
			(/*fnJust*/) =>
				fnNothing();
}

function maybeValues(strMapOrNothing) {
	return S.isJust(strMapOrNothing) ?
		S.values(S.maybeToNullable(strMapOrNothing))
		: [];
}

function maybeKeys(strMapOrNothing) {
	return S.isJust(strMapOrNothing) ?
		S.keys(S.maybeToNullable(strMapOrNothing))
		: [];
}

function u /* istanbul ignore next */ (maybe) {
	return maybe != null && S.isJust(maybe) ? S.maybeToNullable(maybe) : S.Nothing;
}

/**
 * fromMaybe. Shorthand of maybeToNullable.
 * @param maybe
 * @returns {*}
 */
function fM(maybe) {
	return S.maybeToNullable(maybe);
}

/**
 * from StrMap, if Nothing then empty StrMap, if not actual StrMap
 */
function fSM /* istanbul ignore next */ (maybe) {
	return maybe != null && S.isJust(maybe) ? S.maybeToNullable(maybe) : {};
}

export {_ as default, mapValues, maybeShow, maybeValues, maybeKeys, u, fM, fSM};