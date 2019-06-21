import { moveArrayElement } from '../util/schedule'

const initialState = {
	data: null,
	lastUpdated: 0,
	currentTerm: null,
	classes: [],
	selectedCourse: null,
	selectedCourseDetail: null,
	refresh: false,
	layout: { prev: 0, curr: 0, y: 0 },
	courseCards: {}
}

function schedule(state = initialState, action) {
	const newState = { ...state }

	switch (action.type) {
		case 'CHANGE_CLASS_POS': {
			const newClasses = []
			for (let i = 0; i < newState.classes.length; i++) {
				newClasses.push(JSON.parse(JSON.stringify(newState.classes[i])))
			}
			const { draggedClassIndex, anotherClassIndex } = action

			// Method 1: ES6 Syntax
			// [newClasses[draggedClassIndex].tlX, newClasses[anotherClassIndex].tlX] = [newClasses[anotherClassIndex].tlX, newClasses[draggedClassIndex].tlX]
			// [newClasses[draggedClassIndex].tlY, newClasses[anotherClassIndex].tlY] = [newClasses[anotherClassIndex].tlY, newClasses[draggedClassIndex].tlY]
			// [newClasses[draggedClassIndex].brX, newClasses[anotherClassIndex].brX] = [newClasses[anotherClassIndex].brX, newClasses[draggedClassIndex].brX]
			// [newClasses[draggedClassIndex].brY, newClasses[anotherClassIndex].brY] = [newClasses[anotherClassIndex].brY, newClasses[draggedClassIndex].brY]

			// Method 2: The Manual Way
			const { tlX, tlY, brX, brY } = newClasses[draggedClassIndex]
			const { tlX: tlX2, tlY: tlY2, brX: brX2, brY: brY2 } = newClasses[anotherClassIndex]
			newClasses[draggedClassIndex].tlX = tlX2
			newClasses[draggedClassIndex].tlY = tlY2
			newClasses[draggedClassIndex].brX = brX2
			newClasses[draggedClassIndex].brY = brY2
			newClasses[anotherClassIndex].tlX = tlX
			newClasses[anotherClassIndex].tlY = tlY
			newClasses[anotherClassIndex].brX = brX
			newClasses[anotherClassIndex].brY = brY
			newState.classes = moveArrayElement(newClasses, draggedClassIndex, anotherClassIndex)

			// Method 3: Also works, with the introduction of a helper function
			// const { draggedClassIndex, anotherClassIndex } = action
			// const newClasses =  Array.from(Object.create(newState.classes))
			// swap(newClasses[draggedClassIndex], newClasses[anotherClassIndex], 'tlX')
			// swap(newClasses[draggedClassIndex], newClasses[anotherClassIndex], 'tlY')
			// swap(newClasses[draggedClassIndex], newClasses[anotherClassIndex], 'brX')
			// swap(newClasses[draggedClassIndex], newClasses[anotherClassIndex], 'brY')
			// newState.classes = moveArrayElement(newClasses, draggedClassIndex, anotherClassIndex)

			return newState
		}
		case 'SET_SCHEDULE':
			newState.data = action.schedule
			newState.lastUpdated = new Date().getTime()
			return newState
		case 'SET_SCHEDULE_TERM':
			newState.currentTerm = action.term
			return newState
		case 'CLEAR_SCHEDULE_DATA':
			return initialState
		case 'SELECT_COURSE':
			if (newState.selectedCourse === action.selectedCourse) {
				newState.selectedCourse = null
				newState.selectedCourseDetail = null
			} else {
				newState.selectedCourse = action.selectedCourse
				newState.selectedCourseDetail = action.data
			}
			return newState
		case 'POPULATE_CLASS_ARRAY': {
			console.log(	newState.data )
			newState.classes = newState.data.data.map((item, index) => {
				const { subject_code, course_code, units, grade_option, course_title, section_data } = item
				const
					courseUnit      = units,
					courseCode      = subject_code + course_code,
					courseTitle     = course_title,
					sectionID       = section_data[0].section,
					courseProf      = section_data[0].instructor_name,
					courseSections  = section_data
				return {
					courseUnit,
					courseCode,
					courseTitle,
					sectionID,
					courseProf,
					courseSections,
					tlX: 0,
					tlY: 0,
					brX: 0,
					brY: 0
				}
			})
			console.log('class', newState.classes)
			return newState
		}
		case 'REFRESH_CLASS_LIST': {
			newState.refresh = !newState.refresh
			console.log(newState.refresh)
			return newState
		}
		case 'SCHEDULE_LAYOUT_CHANGE': {
			const shift = action.y - state.layout.curr
			return {
				newState,
				classes: [...state.classes].map(item => ({ ...item, tlY: item.tlY - shift, brY: item.brY - shift })),
				layout: { ...state.layout, prev: state.layout.curr, curr: action.y }
			}
		}
		case 'UPDATE_CLASS_DATA': {
			newState.classes = action.classes
			console.log('new state classes',newState.classes)
			return newState
		}
		case 'UPDATE_COURSE_CARD': {
			const { name, x, y, width, height } = action

			if (name in newState.courseCards) {
				newState.courseCards = { ...newState.courseCards, [name]: [] }
				for (let i = 0; i < state.courseCards[name].length; i++) {
					newState.courseCards[name].push(JSON.parse(JSON.stringify(state.courseCards[name][i])))
				}
				newState.courseCards[name].push({ x, y, width, height })
			} else {
				newState.courseCards = { ...newState.courseCards, [name]: [{ x, y, width, height }] }
			}
			console.log(newState.courseCards)
			return newState
		}
		case 'RESET_COURSE_CARD': {
			newState.courseCards = {}
			return newState
		}
		default:
			return state
	}
}

module.exports = schedule
