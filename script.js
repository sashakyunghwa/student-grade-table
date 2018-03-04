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
    $('.btn-success').on('click', handleAddClicked);
    $('.btn-default').on('click', handleCancelClick);
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
    var deleteButton = $('<button>', {
        'class': 'btn btn-danger',
        text: 'DELETE',
        on: {
            'click': function(){
                removeStudent(studentObj);
            }
        }
    });
    deleteButton[0].this = this;
    operations.append(deleteButton)
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

// deleteButton[0].



