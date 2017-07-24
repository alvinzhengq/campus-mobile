import React from 'react';
import {
	View,
	Text,
	ListView,
	StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';

import {
	MAX_CARD_WIDTH,
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	NAVIGATOR_HEIGHT,
	TAB_BAR_HEIGHT,
} from '../../styles/LayoutConstants';
import EmptyItem from './EmptyItem';
import SpecialEventsItem from './SpecialEventsItem';
import SpecialEventsHeader from './SpecialEventsHeader';

const dataSource = new ListView.DataSource({
	rowHasChanged: (r1, r2) => r1 !== r2,
	sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});

const SpecialEventsListView = ({ addSpecialEvents, specialEventsSchedule, specialEventsScheduleIds, removeSpecialEvents, saved,
	disabled, personal, rows, scrollEnabled, style }) => {
	if (personal && Array.isArray(saved) && saved.length === 0) {
		return (
			<View style={[style, rows ? styles.card : styles.full]}>
				<Text style={styles.noSavedSessions}>
					Click the star icon next to a session to save it to your list.
				</Text>
			</View>
		);
	} else {
		return (
			<ListView
				style={[style, rows ? styles.card : styles.full]}
				scrollEnabled={scrollEnabled}
				stickySectionHeadersEnabled={false}
				dataSource={
					dataSource.cloneWithRowsAndSections(
						convertToTimeMap(
							specialEventsSchedule,
							adjustData(specialEventsSchedule, specialEventsScheduleIds, saved, personal, rows)
						)
					)
				}
				renderRow={(rowData, sectionID, rowID, highlightRow) => {
					// Don't render first row bc rendered by header
					if (Number(rowID) !== 0) {
						return (
							<View style={styles.rowContainer}>
								<EmptyItem />
								<SpecialEventsItem
									specialEventsData={rowData}
									saved={saved.includes(rowData.id)}
									add={(disabled) ? null : addSpecialEvents}
									remove={removeSpecialEvents}
								/>
							</View>
						);
					} else {
						return null;
					}
				}}
				renderSectionHeader={(sectionData, sectionID) => (
					// Render header along with first row
					<View style={styles.rowContainer}>
						<SpecialEventsHeader
							timestamp={sectionID}
						/>
						<SpecialEventsItem
							specialEventsData={sectionData[0]}
							saved={saved.includes(sectionData[0].id)}
							add={(disabled) ? null : addSpecialEvents}
							remove={removeSpecialEvents}
						/>
					</View>
				)}
			/>
		);
	}
};

/*
	Filters what session ids to use based on personal/saved and/or rows
	Additional filtering can be done here
	@returns Array of session ids
 */
function adjustData(scheduleIdMap, scheduleIdArray, savedArray, personal, rows) {
	// Filter out saved items
	if (!personal || !Array.isArray(savedArray)) {
		const keys = scheduleIdArray;
		if (!rows) {
			return scheduleIdArray;
		} else {
			const trimmed = [];

			for (let i = 0; i < rows; ++i) {
				trimmed.push(keys[i]);
			}
			return trimmed;
		}
	} else {
		let filtered = [];
		for (let i = 0; i < savedArray.length; ++i) {
			const key = savedArray[i];
			filtered.push(key);
		}

		// Displaying for homecard
		// Remove sessions that have passed
		if (rows) {
			const now = Date.now();
			if (filtered.length > rows) {
				const temp = filtered.slice();
				for (let j = 0; j < filtered.length; ++j) {
					const key = filtered[j];
					const itemTime = scheduleIdMap[key]['start-time'];

					if (now > itemTime) {
						const index = temp.indexOf(key);
						temp.splice(index, 1);
					}

					if (temp.length <= rows) {
						break;
					}
				}

				if (temp.length > rows) {
					filtered = temp.slice(0, rows);
				} else {
					filtered = temp;
				}
			}
		}
		return filtered;
	}
}

/*
	@returns Object that maps keys from scheduleArray to Objects in scheduleMap
*/
function convertToTimeMap(scheduleMap, scheduleArray, header = false) {
	const timeMap = {};

	if (Array.isArray(scheduleArray)) {
		scheduleArray.forEach((key) => {
			const session = scheduleMap[key];
			if (!timeMap[session['start-time']]) {
				// Create an entry in the map for the timestamp if it hasn't yet been created
				timeMap[session['start-time']] = [];
			}
			timeMap[session['start-time']].push(session);
		});

		// Remove an item from section so spacing lines up
		if (header) {
			Object.keys(timeMap).forEach((key) => {
				timeMap[key].pop();
			});
		}
	}
	return timeMap;
}

const mapStateToProps = (state) => (
	{
		specialEventsSchedule: state.specialEvents.data.schedule,
		specialEventsScheduleIds: state.specialEvents.data.uids,
		saved: state.specialEvents.saved
	}
);

const mapDispatchToProps = (dispatch) => (
	{
		addSpecialEvents: (id) => {
			dispatch({ type: 'ADD_SPECIAL_EVENTS', id });
		},
		removeSpecialEvents: (id) => {
			dispatch({ type: 'REMOVE_SPECIAL_EVENTS', id });
		}
	}
);

const ActualSpecialEventsListView = connect(
	mapStateToProps,
	mapDispatchToProps
)(SpecialEventsListView);

const styles = StyleSheet.create({
	rowContainer: { flexDirection: 'row', height: 76 },
	full: { width: WINDOW_WIDTH, height: (WINDOW_HEIGHT - NAVIGATOR_HEIGHT - TAB_BAR_HEIGHT) },
	card: { width: MAX_CARD_WIDTH },
	noSavedSessions: { flexGrow: 1, fontSize: 18, textAlign: 'center', padding: 40, lineHeight: 30 },
});

export default ActualSpecialEventsListView;
