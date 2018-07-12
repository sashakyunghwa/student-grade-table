/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */

var student_array = [];
var globalData;

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
    addClickHandlersToElements();
}

/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined} 
* @returns  {undefined}
*     
*/
function addClickHandlersToElements(){
    $('#add').on('click', handleAddClicked);
    $('.btn-default').on('click', handleCancelClick);
    $('#getData').on('click', handleGetDataClick);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked(event){
    addStudent();
}

/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
    clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form, and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
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
/***************************************************************************************************
 * clearAddStudentFormInputs - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentObj){
    var studentAddName = $('<td>').text(studentObj.name);
    var studentAddCourse = $('<td>').text(studentObj.course);
    var studentAddGrade = $('<td>').text(studentObj.grade);
    var operations = $('<td>');
    var newRow =$('<tr>');
    var updateButton = $('<button>', {
        'class': 'btn btn-primary',
        text: 'UPDATE',
        on: {
            click: function(){
                $('.new-name').val(studentObj.name);
                $('.new-course').val(studentObj.course);
                $('.new-grade').val(studentObj.grade);
                $('#updateModal').modal('show');
                updateStudentList(student_array);
            }
           
        }
       
    });
    // operations.append(updateButton, deleteButton);
    // newRow.append(studentAddName, studentAddCourse, studentAddGrade, operations);
    // $('.student-list')
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
    var newTableRow = $('<tr>').addClass("student").append(studentAddName, studentAddCourse, studentAddGrade, operations);
    studentObj.displayRow = newTableRow;
    $('.student-list tbody').append(newTableRow);
}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(array){
    $(".student").remove();
    for(var i = 0; i < array.length; i++){
        console.log(array[i]);
        renderStudentOnDom(array[i]);
    }
    console.log(array);
    var averageGrade = calculateGradeAverage(array);
    renderGradeAverage( Math.floor(averageGrade) );
}

/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(array){
    var total = null;
    for(var i = 0; i < array.length; i++){
        total += parseInt(array[i].grade);
    }
    var averageGrade = total / array.length;
    return averageGrade;
}

/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */

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
            debugger;
            globalData = data;
            for(var i = 0; i < globalData.data.length; i++){
                // console.log("student objects:", globalData.data[i]);
                student_array.push(globalData.data[i]);
            };
            updateStudentList(student_array);
        },
    });

}


// function updateStudentCheck(studentObj) { 
//     $('.update-student-button').off();
//     $('.new-student-icon').popover('');
//     $('.new-course-icon').popover('hide');
//     $('.new-grade-icon').popover('hide');
//     $('.update-student-button').click(() => { 
//           var newStudentName = $('.new-name').val();
//           var newCourse = $('.new-course').val();
//           var newStudentGrade = $('.new-grade').val();

//           var newNameValid = null;
//           var newCourseValid = null;
//           var newGradeValid = null;

//           if(newStudentName.length < 2 || newStudentName === '') {
//                 $('.new-student-icon').popover('show');
//                 newNameValid = false;
//           } else {
//                 $('.new-student-icon').popover('hide');
//                 newNameValid = true;
//           };

//           if(newCourse.length < 2 || newCourse === '') {
//                 $('.new-course-icon').popover('show');
//                 newCourseValid = false;
//           } else {
//                 $('.new-course-icon').popover('hide');
//                 newCourseValid = true;
//           };

//           if(isNaN(newStudentGrade) || newStudentGrade === '' || newStudentGrade > 100) {
//                 $('.new-grade-icon').popover('show');
//                 newGradeValid = false;
//           } else {
//                 $('.new-grade-icon').popover('hide');
//                 newGradeValid = true;
//           };

//           if(newNameValid && newCourseValid && newGradeValid) {
//                 updateStudent(studentObj);
//                 $('#updateModal').modal('hide'); 
//           };
//     });
// };



