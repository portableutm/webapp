import React from 'react';
import {render, fireEvent, act, wait} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axiosMock from 'axios';
import LoginScreen from '../LoginScreen';
import {queryByText} from "@testing-library/dom";

const mockAxios = jest.genMockFromModule('axios');
mockAxios.create = jest.fn(() => mockAxios);


test('loads, tries logging in, success', async () => {
	const {container, debug, getByText, getByLabelText} = render(<LoginScreen/>);
	mockAxios.post.mockImplementationOnce(() =>
		Promise.resolve({ data: 'token123' })
	);

	act(() => {
		const user = getByLabelText('Username');
		const pass = getByLabelText('Password');

		fireEvent.change(user, {target: {value: 'User123'}});
		fireEvent.change(pass, {target: {value: 'Pass123'}});
		fireEvent.click(getByText('Log in'));
	});

	expect(axiosMock.post).toHaveBeenCalledTimes(1);
	await wait(() =>
		expect(queryByText(container, 'Logged in succesfully')).toBeInTheDocument()
	);
});