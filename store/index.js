export const state = () => ({
  students: [],
  attendanceRecords: [] // Placeholder for attendance data
});

export const mutations = {
  addStudent(state, studentName) {
    state.students.push({ id: Date.now(), name: studentName });
  },
  markAttendance(state, record) {
    // record is expected to be an object like { studentId: 'someId', timestamp: 'YYYY-MM-DD HH:mm:ss' }
    state.attendanceRecords.push(record);
  }
};

export const actions = {
  addNewStudent({ commit }, studentName) {
    commit('addStudent', studentName);
  },
  recordAttendance({ commit }, record) {
    // Logic for recording attendance, potentially async operations, then commit
    commit('markAttendance', record);
  }
};

export const getters = {
  getStudentList: state => state.students,
  getAttendance: state => state.attendanceRecords // Getter for attendance records
};
