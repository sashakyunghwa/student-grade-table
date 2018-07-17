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
}

function handleAddClicked(event){
    addStudent();
}

function handleCancelClick(){
    clearAddStudentFormInputs();
}

function addStudent(){
    var student = {};
    student.name = $('#studentName').val();
    student.course = $('#course').val();
    student.grade = $('#studentGrade').val();
    console.log(student);
    student_array.push(student);
    clearAddStudentFormInputs();
    updateStudentList(student_array);
}

function clearAddStudentFormInputs(){
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
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
                updateStudent(studentObj);
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
    $('.update-student-button').click(setDataFromFirebase);
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
            // console.log("data from server:", data);
            globalData = data;
            for(var i = 0; i < globalData.data.length; i++){
                // console.log("student objects:", globalData.data[i]);
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

function setDataFromFirebase(){
    var studentObj = {};
    studentObj.name = $('.new-name').val();
    studentObj.course = $('.new-course').val();
    studentObj.grade = $('.new-grade').val();
    studentObj.id = $('.new-id').val();
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




