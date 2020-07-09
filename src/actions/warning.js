import S from 'sanctuary';

export const setWarning = (store, text) => {
	store.setState({warning: S.Just(text)});
};
export const close = (store) => {
	store.setState({warning: S.Nothing});
};