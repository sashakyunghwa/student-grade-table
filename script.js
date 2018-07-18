$(document).ready(initializeApp);

var student_array = [];
var globalData;
var studentDataArray;
var studentData;
var database;

function initializeApp(){
    addClickHandlersToElements();
    getDataFromFirebase();
}

function addClickHandlersToElements(){
    $('#add').on('click', handleAddClicked);
    $('.btn-default').on('click', handleCancelClick);
    $('input').on('keypress', hidePopover);
}

function handleAddClicked(event){
    addStudent();
}

function handleCancelClick(){
    clearAddStudentFormInputs();
    clearPopover();
}

function hidePopover(){
    $(this).closest('.form-group').find('[data-toggle]').popover('hide');
}

function addStudent() {
    var studentName = $('#studentName').val();
    var course = $('#course').val();
    var studentGrade = $('#studentGrade').val();
    var student = {
          name:studentName,
          course:course,
          grade:studentGrade
    };
    var nameValid = null;
    var courseValid = null;
    var gradeValid = null;

    if(studentName.length < 2 || studentName === '') {
          $('.student-icon').popover('show');
          nameValid = false;
    } else {
          $('.student-icon').popover('hide');
          nameValid = true;
    }

    if(course.length < 2 || course === '') {
          $('.course-icon').popover('show');
          courseValid = false;
    } else {
          $('.course-icon').popover('hide');
          courseValid = true;
    }

    if(isNaN(studentGrade) || studentGrade === '' || studentGrade > 100) {
          $('.grade-icon').popover('show');
          gradeValid = false;
    } else {
          $('.grade-icon').popover('hide');
          gradeValid = true;
    }

    if(nameValid && courseValid && gradeValid) {
          student_array.push(student);
        clearAddStudentFormInputs();
        updateStudentList(student_array);
        firebase.database().ref("Students").push({
            name: student.name,    
            course: student.course,
            grade: student.grade
        });
    };
};

function updateStudentCheck(studentObj) {
    $('#updateModal').modal('show');

    $('.new-student-icon').popover('hide');
    $('.new-course-icon').popover('hide');
    $('.new-grade-icon').popover('hide');
    $('.update-student-button').click(() => { 
          var newStudentName = $('.new-name').val();
          var newCourse = $('.new-course').val();
          var newStudentGrade = $('.new-grade').val();

          var newNameValid = null;
          var newCourseValid = null;
          var newGradeValid = null;

          if(newStudentName.length < 2 || newStudentName === '') {
                $('.new-student-icon').popover('show');
                newNameValid = false;
          } else {
                $('.new-student-icon').popover('hide');
                newNameValid = true;
          };

          if(newCourse.length < 2 || newCourse === '') {
                $('.new-course-icon').popover('show');
                newCourseValid = false;
          } else {
                $('.new-course-icon').popover('hide');
                newCourseValid = true;
          };

          if(isNaN(newStudentGrade) || newStudentGrade === '' || newStudentGrade > 100) {
                $('.new-grade-icon').popover('show');
                newGradeValid = false;
          } else {
                $('.new-grade-icon').popover('hide');
                newGradeValid = true;
          };

          if(newNameValid && newCourseValid && newGradeValid) {
                setDataFromFirebase({
                    name: newStudentName,
                    course: newCourse,
                    grade: newStudentGrade,
                    id: studentObj.id
                });
                $('#updateModal').modal('hide'); 
          };
    });
};

function clearAddStudentFormInputs(){
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
}

function clearPopover(){
    $('.form-group').find('[data-toggle]').popover('hide');
}

function renderStudentOnDom(studentObj){
    var studentAddName = $('<td>').text(studentObj.name);
    var studentAddCourse = $('<td>').text(studentObj.course);
    var studentAddGrade = $('<td>').text(studentObj.grade);
    var operations = $('<td>');
    var newTableRow =$('<tr>');
    var updateButton = $('<button>', {
        'class': 'btn btn-primary',
        text: 'UPDATE',
        on: {
            click: function(){
                updateStudentCheck(studentObj);
            }    
        }
    });
    var deleteButton = $('<button>', {
        'class': 'btn btn-danger',
        text: 'DELETE',
        on: {
            click: function(){
                removeStudent(studentObj);
            }
        }
    });
    deleteButton[0].this = this;
    operations.append(updateButton, deleteButton)
    newTableRow = $('<tr>').addClass("student").append(studentAddName, studentAddCourse, studentAddGrade, operations);
    studentObj.displayRow = newTableRow;
    $('.student-list tbody').append(newTableRow);
}

function updateStudentList(array){
    console.log('confirm clicked');
    $(".student").remove();
    for(var i = 0; i < array.length; i++){
        console.log(array[i]);
        renderStudentOnDom(array[i]);
    }
    console.log(array);
    var averageGrade = calculateGradeAverage(array);
    renderGradeAverage( Math.floor(averageGrade) );
}

function updateStudent(studentObj){
    $('#updateModal').modal('show');
    $('.new-name').val(studentObj.name);
    $('.new-course').val(studentObj.course);
    $('.new-grade').val(studentObj.grade);
    $('.new-id').val(studentObj.id);
}

function calculateGradeAverage(array){
    var total = null;
    for(var i = 0; i < array.length; i++){
        total += parseInt(array[i].grade);
    }
    var averageGrade = total / array.length;
    return averageGrade;
}

function renderGradeAverage(averageGrade){
    $('.avgGrade').text(averageGrade);
}
 
function removeStudent(student){
    var studentIndex = student_array.indexOf(student);
    student_array.splice(studentIndex, 1);
    student.displayRow.remove();
    renderGradeAverage(calculateGradeAverage(student_array));
    firebase.database().ref("Students/" + student.id).remove();
}

function handleGetDataClick(){
    console.log("handle data click call");
    $.ajax({
        dataType: 'json',
        method: 'post',
        url: 'http://s-apis.learningfuze.com/sgt/get',
        data: {'api_key': 'T5a2qipvnG'
        },
        success: function(data){
            globalData = data;
            for(var i = 0; i < globalData.data.length; i++){
                student_array.push(globalData.data[i]);
            };
            updateStudentList(student_array);
        },
    });
}

function getDataFromFirebase(){
    database = firebase.database().ref("Students");
    studentData = database.on("value", snap => { 
        console.log(snap.val());
        studentDataArray = snap.val();
        handleGetDataClick();
    });
}

function setDataFromFirebase(studentObj){
    firebase.database().ref("Students/" + studentObj.id).set({
        name: studentObj.name,    
        course: studentObj.course,
        grade: studentObj.grade
    });
    $('#updateModal').modal('hide');
} 

function handleGetDataClick(){
    student_array = [];
    for(var id in studentDataArray){
        console.log('student objects:', studentDataArray[id]);
        studentDataArray[id].id = id;
        student_array.push(studentDataArray[id]);
    };
    updateStudentList(student_array);
}






