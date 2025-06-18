import { state as indexState, mutations, actions, getters } from '@/store/index.js'; // Assuming store/index.js for simplicity

// Create a clone of the initial state to avoid mutations leaking between tests
const createInitialState = () => JSON.parse(JSON.stringify(indexState()));

describe('Vuex Student Management Store', () => {
  describe('mutations', () => {
    test('addStudent adds a student to the state', () => {
      const state = createInitialState();
      const studentName = 'John Doe';

      // Spy on Date.now() to control the ID
      const mockId = 1234567890;
      jest.spyOn(Date, 'now').mockImplementation(() => mockId);

      mutations.addStudent(state, studentName);

      expect(state.students).toHaveLength(1);
      expect(state.students[0]).toEqual({ id: mockId, name: studentName });

      // Restore Date.now()
      Date.now.mockRestore();
    });
  });

  describe('actions', () => {
    test('addNewStudent commits addStudent mutation', () => {
      const commit = jest.fn();
      const studentName = 'Jane Doe';

      actions.addNewStudent({ commit }, studentName);

      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith('addStudent', studentName);
    });
  });

  describe('getters', () => {
    test('getStudentList returns the students array', () => {
      const state = createInitialState();
      const student1 = { id: 1, name: 'Alice' };
      const student2 = { id: 2, name: 'Bob' };
      state.students.push(student1);
      state.students.push(student2);

      const studentList = getters.getStudentList(state);
      expect(studentList).toHaveLength(2);
      expect(studentList).toEqual([student1, student2]);
    });

    test('getStudentList returns an empty array if no students', () => {
      const state = createInitialState();
      const studentList = getters.getStudentList(state);
      expect(studentList).toHaveLength(0);
      expect(studentList).toEqual([]);
    });
  });

  // Placeholder for attendance tests from the previous subtask, if they were in the same file
  describe('Vuex Attendance Management Store (Placeholders)', () => {
    test('markAttendance mutation (placeholder)', () => {
      const state = createInitialState(); // Includes attendanceRecords: []
      const attendanceRecord = { studentId: 'student123', timestamp: '2024-01-01 10:00:00' };
      mutations.markAttendance(state, attendanceRecord);
      expect(state.attendanceRecords).toHaveLength(1);
      expect(state.attendanceRecords[0]).toEqual(attendanceRecord);
    });

    test('recordAttendance action (placeholder)', () => {
      const commit = jest.fn();
      const attendanceRecord = { studentId: 'student456', timestamp: '2024-01-02 11:00:00' };
      actions.recordAttendance({ commit }, attendanceRecord);
      expect(commit).toHaveBeenCalledWith('markAttendance', attendanceRecord);
    });

    test('getAttendance getter (placeholder)', () => {
      const state = createInitialState();
      const record = { studentId: 'student789', timestamp: '2024-01-03 12:00:00' };
      state.attendanceRecords.push(record);
      const attendanceList = getters.getAttendance(state);
      expect(attendanceList).toEqual([record]);
    });
  });
});
