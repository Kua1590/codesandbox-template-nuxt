<template>
  <div>
    <h1>Student Management</h1>
    <div>
      <input type="text" v-model="newStudentName" placeholder="Enter student name" />
      <button @click="handleAddStudent">Add Student</button>
    </div>
    <div>
      <h2>Student List</h2>
      <ul>
        <li v-for="student in students" :key="student.id">
          {{ student.name }}
          <StudentQRCode :studentIdentifier="student.name" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import StudentQRCode from '@/components/StudentQRCode.vue';

export default {
  components: {
    StudentQRCode
  },
  data() {
    return {
      newStudentName: ''
    };
  },
  computed: {
    ...mapState({
      students: state => state.students // Accessing the students state directly
    })
    // Or using mapGetters:
    // ...mapGetters({
    //  students: 'getStudentList'
    // })
  },
  methods: {
    ...mapActions({
      addStudentAction: 'addNewStudent' // Maps this.addStudentAction to this.$store.dispatch('addNewStudent')
    }),
    handleAddStudent() {
      if (this.newStudentName.trim() !== '') {
        this.addStudentAction(this.newStudentName);
        this.newStudentName = ''; // Clear the input field
      }
    }
  }
};
</script>

<style scoped>
/* Basic styling for the student management page */
div {
  font-family: sans-serif;
  padding: 20px;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  color: #555;
  margin-top: 30px;
  margin-bottom: 10px;
}

input[type="text"] {
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 4px;
}
</style>
