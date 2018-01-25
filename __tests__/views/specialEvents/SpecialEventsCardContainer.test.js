import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4';

// Component to be tested
import { SpecialEventsCardContainer } from '../../../app/views/specialEvents/SpecialEventsCardContainer';
import { SPECIAL_EVENTS_RESPONSE } from '../../../mockApis/specialEventsApi';

Enzyme.configure({ adapter: new Adapter() });

// Mock props passed down from state
const initialState = {
	specialEventsData: SPECIAL_EVENTS_RESPONSE,
	saved: [],
	hideCard: jest.fn()
};

// Set up component to be rendered
function setup(props) {
	return shallow(<SpecialEventsCardContainer {...props} />);
}

test('renders without crashing', () => {
	const tree = setup(initialState);
	expect(tree).toMatchSnapshot();
});
