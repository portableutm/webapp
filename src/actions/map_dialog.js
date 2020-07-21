import S from 'sanctuary';

export const open = (store, title = 'Information', text = 'No information', rightButtonText, rightButtonOnClick) => {
	store.setState({
		map_dialog: {
			open: true,
			title: title,
			text: text,
			rightButtonText: rightButtonText ? S.Just(rightButtonText) : S.Nothing,
			rightButtonOnClick: rightButtonOnClick ? S.Just(rightButtonOnClick) : S.Nothing
		}
	});
};
export const close = (store) => {
	store.setState({
		map_dialog: {
			open: false,
			title: '',
			text: '',
			rightButtonText: S.Nothing,
			rightButtonOnClick: S.Nothing
		}
	});
};