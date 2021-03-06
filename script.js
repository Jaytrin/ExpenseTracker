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
var student_array = [];
var student_id;

/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
    console.log('initialized');
    addClickHandlersToElements();
    getData();
}


/***************************************************************************************************
* addClickHandlerstoElements
* @params {undefined}
* @returns  {undefined}
*
*/
function addClickHandlersToElements(){
    console.log('addClickHandlersToElements running');
    $('button.btn.btn-success').click(handleAddClicked);
    $('button.btn.btn-default').click(handleCancelClick);
    $('button.btn.btn-primary').click(handleGetDataClick);
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param {object} event  The event object from the click
 * @return: 
       none
 */
function handleAddClicked(){
    console.log('handleAddClicked running');
    addStudent();

}
/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick(){
    console.log('handleCancelClick running');
    clearAddStudentFormInputs();
}
/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddStudentFormInputs, updateStudentList
 */
function addStudent(){
    console.log('addStudent running');
    var student_object = {name: $('#studentName').val(),
                            course: $('#course').val(),
                            grade: $('#studentGrade').val()};
    student_array.push(student_object);
    sendData(student_object);
    clearAddStudentFormInputs();
    updateStudentList(student_array);
}
/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs(){
    console.log('clearAddStudentFormInputs running');
    $('#studentName').val("");
    $('#course').val("");
    $('#studentGrade').val("");
}
/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentObj){
    console.log('renderStudentOnDom running');
    var studentNameElement = $('<td>').text(studentObj.name);
    var studentCourseElement = $('<td>').text(studentObj.course);
    var studentGradeElement = $('<td>').text(studentObj.grade);

    var deleteButton = $('<button>').addClass('btn btn-danger').text('Delete');
    var deleteButtonTD = $('<td>').append(deleteButton);
    var newStudentData = $('<tr>').append(studentNameElement, studentCourseElement, studentGradeElement, deleteButtonTD);

    $('.student-list tbody').append(newStudentData);

    deleteButton.click(function(){
        var studentIndex = student_array.indexOf(studentObj);
        removeData(studentObj);
        student_array.splice(studentIndex,1);
        $(this).parents('tr').remove();
    })


}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(students){
    console.log('updateStudentList running');

    for(var i = 0; i < students.length; i++){
        renderStudentOnDom(students[i]);
        renderGradeAverage(calculateGradeAverage(students));
    }
}
/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}
 */
function calculateGradeAverage(array){
    console.log('calculateGradeAverage running');
    var studentGradeSum = 0;
    for (var studentIndex = 0; studentIndex < array.length; studentIndex++){
        studentGradeSum = parseInt(studentGradeSum) + parseInt(array[studentIndex].grade);
    }
    var result = studentGradeSum / array.length;
    return result;
}
/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none
 */
function renderGradeAverage(average) {
    console.log('renderGradeAverage running');
    var roundedAverage = Math.round(average);
    $('.avgGrade.label.label-default').text(roundedAverage);
}
/***************************************************************************************************
 * handleGetDataClick - Event Handler when user clicks the get data button, should pull records from DB
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: getData
 */

function handleGetDataClick(){
    console.log('handleGetDataClick running');
    getData();
}

function getData(returnedObject){
    console.log('get data running');

    var ajaxConfig = {
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/get',
        method: 'post',
        data: {api_key: 'wLeMnZ7QcV'},
        success:
            function(returnedObject) {
            console.log('Success');
            console.log('result', returnedObject);

            for (var i = 0; i < returnedObject.data.length; i++) {
                var student_object = {
                    id: returnedObject.data[i].id,
                    name: returnedObject.data[i].name,
                    course: returnedObject.data[i].course,
                    grade: returnedObject.data[i].grade
                };
                student_array.push(student_object);
            }

            updateStudentList(student_array);


        },
        error: function(){
            console.log('Failure');
        }}

    $.ajax(ajaxConfig);
    }

function sendData(createdObject){
    console.log('Sending Data to Server');

    var ajaxConfig = {
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/create',
        method: 'post',
        data: {api_key: 'wLeMnZ7QcV',
                name: createdObject.name,
                course: createdObject.course,
                grade: createdObject.grade},
        success:
            function(returnedObject){
            console.log('Send Data Success');
            var newStudentID = returnedObject.new_id;
            console.log('student ID:', newStudentID);
            createdObject.id = newStudentID;
            return createdObject;
            },
        error:
            function(){
            console.log('Send Data Error');
            }
    }
    $.ajax(ajaxConfig);
}

function removeData(createdObject){
    console.log('RemoveData Running');
    var ajaxConfig = {
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/delete',
        method: 'post',
        data: {api_key: 'wLeMnZ7QcV',
            student_id: createdObject.id},
        success: function(){
            console.log('Removing Data from Server Succeeded')
        },
        error: function(){
            console.log('Removing Data from Server Failed')
        }
    }
    $.ajax(ajaxConfig);
}