$(document).ready(initializeApp);

const initialCheck = {
    budget: true,
    budgetBarCount: 0,
    expense: true,
    expenseRowCount: 0,
    currentUser: null
};

const budgetObject = {
    labels: [],
    values: []
};


function initializeApp(){
    clickHandler();
}
/***************************************************************************************************
 * clickHandlers
 */
//function to handle clicks

function clickHandler(){
    $('#signUpBtn').on('click', function() {
        $('#signUpModal').modal('show')
    });

    $('#loginBtn').on('click', function() {
        $('#loginModal').modal('show')
    });

    $('#signUpSubmit').on('click', signUp);

    $('#loginSubmit').on('click', login);
    
}

function clickHere(){
    $('#signUpModal').modal('show')
}
/***************************************************************************************************
 * Create Pie Chart
 */
//function to create labels, background color and data.

function createDoughnutChart(dataObject){
    var chartLocation = document.getElementById("doughnut-chart");
    var newChart = new Chart(chartLocation, {
        type: 'doughnut',
        data: {
          labels: [],
          datasets: [
            {
              label: "Budget Allocation",
              borderWidth: [.5],
              backgroundColor: ["#8b7cf7", "#4285F4", "#0F9D58", "#F4B400", "#ff8c00", "#DB4437"],
              data: []
            }
          ]
        },
        options: {
            cutoutPercentage: 60,
            aspectRatio: 1.1,
            plugins: {
                labels: {
                  render: 'percentage',
                  fontColor: 'white',
                  precision: 0
                }
              },
              elements: {
                arc: {
                    borderWidth: 0
                }
            },
          title: {
            display: false,
            text: 'Allocation of Budgets'
          },
          legend: {
            display: false
         }
        }
    });

    if(dataObject){
        newChart.data.labels = dataObject.labels;
        console.log('labels: ', newChart.data.labels);
        console.log('data: ', newChart.data.datasets.data);
        newChart.data.datasets[0].data = dataObject.values;
        newChart.update();
    }

}


/***************************************************************************************************
 * Ajax call to signUp
 */
//function to creates the request for signup

    function signUp(){
        console.log('sign up running');
        var fname = $("input.signUp[name=fname]").val();
        var lname = $("input.signUp[name=lname]").val();
        var email = $("input.signUp[name=email]").val();
        var username = $("input.signUp[name=username]").val();
        var password = $("input.signUp[name=password]").val();

        $.ajax({
            url: 'http://localhost:3050/signUp',
            cache: false,
            data: {
                fname: fname,
                lname: lname,
                email: email,
                username: username,
                password: password
            },
            method: 'post',
            dataType: 'json'
        })}

/***************************************************************************************************
 * Ajax call to login
 */
//function to creates the request for signup

    function login(){
        console.log('login running');
        
        var username = $("input.login[name=username]").val();
        var password = $("input.login[name=password]").val();

        $.ajax({
            url: 'http://localhost:3050/login',
            cache: false,
            data: {
                username: username,
                password: password
            },
            method: 'post',
            dataType: 'json'
    }).then(handleLoggedStatus);

    initialCheck.currentUser = username;
}

/***************************************************************************************************
 * Update DOM with main page
 */
//function runs after login and updates the DOM with contents of the main page

function loadMainPage(){
    $('.landing-page').remove();
    $('#loginModal').modal('hide');

let mainPage = `
    <div class="waterColorBackground"style="height: 100%;">
    <!-- Nav Bar Start -->
                <nav class="navbar navbar-expand-lg navbar-dark bg-dark m-0 rounded-0">
                    <a class="navbar-brand p-0" style="height: auto; font-weight: bold;" href="#">Fru<span class="logo">gal</span></a>
                    <button class="navbar-toggler ml-auto" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav mr-auto">
                        <a class="nav-item nav-link active" href="#">Home <span class="sr-only">(current)</span></a>
                        <a class="nav-item nav-link" href="#">Features</a>
                    </div>
                    <div class="navbar-nav ml-auto">
                        <a class="nav-item nav-link" href="#">Login</a>
                        <a class="nav-item nav-link" href="#">Sign Up</a>
                    </div>
                    </div>
                </nav>
    <!-- Nav Bar End -->
    
    <!-- Doughnut Chart Container -->
                <div class="container lineBackground mb-0 mt-0 col-lg-6 d-flex p-0" style="height: 50vh">
                    <div class="align-self-center mx-auto">
                        <div class="doughnutChart">
                            <canvas id="doughnut-chart"></canvas>
                        </div>
                    </div>    
                </div>
    <!-- Doughnut Chart Container End -->
    
                
    <!-- Budget Graphs Start -->
                <div class="container mt-0 mb-0 bg-white col-lg-6 pb-5" style="height: auto">
                    <div class="container no-data text-center initial-budget">
                        <p class="pt-3 mb-0 text-secondary ">Please create your first budget.</p>
                    </div>
                    <div class="budgetSection">
                    </div>
                    <!-- <div class="container">
                            <p class="h6 m-0 float-left mt-3 mb-0">Food</p>
                            <p class="m-0 float-right text-secondary mt-3 mb-0" style="font-size: .75rem">$75 Remaining</p>
                        <div class="container p-0 progress" style="height: 1.5rem">
                            <div class="progress-bar progress-bar-striped custom-red" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                <span class="justify-content-left position-absolute p-1">$25 of $100</span>
                            </div>
                        </div>
                    </div>
    
                    <div class="container">
                            <p class="h6 m-0 float-left mt-1 mb-0">Food</p>
                            <p class="m-0 float-right text-secondary mt-1 mb-0" style="font-size: .75rem">$75 Remaining</p>
                        <div class="container p-0 progress" style="height: 1.5rem">
                            <div class="progress-bar progress-bar-striped custom-orange" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                <span class="justify-content-left position-absolute p-1">$25 of $100</span>
                            </div>
                        </div>
                    </div>
    
                    <div class="container">
                            <p class="h6 m-0 float-left mt-1 mb-0">Food</p>
                            <p class="m-0 float-right text-secondary mt-1 mb-0" style="font-size: .75rem">$75 Remaining</p>
                        <div class="container p-0 progress" style="height: 1.5rem">
                            <div class="progress-bar progress-bar-striped custom-yellow" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                <span class="justify-content-left position-absolute p-1">$25 of $100</span>
                            </div>
                        </div>
                    </div>
    
                    <div class="container">
                            <p class="h6 m-0 float-left mt-1 mb-0">Food</p>
                            <p class="m-0 float-right text-secondary mt-1 mb-0" style="font-size: .75rem">$75 Remaining</p>
                        <div class="container p-0 progress" style="height: 1.5rem">
                            <div class="progress-bar progress-bar-striped custom-green" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                <span class="justify-content-left position-absolute p-1">$25 of $100</span>
                            </div>
                        </div>
                    </div>
    
                    <div class="container">
                            <p class="h6 m-0 float-left mt-1 mb-0">Food</p>
                            <p class="m-0 float-right text-secondary mt-1 mb-0" style="font-size: .75rem">$75 Remaining</p>
                        <div class="container p-0 progress" style="height: 1.5rem">
                            <div class="progress-bar progress-bar-striped custom-blue" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                <span class="justify-content-left position-absolute p-1">$25 of $100</span>
                            </div>
                        </div>
                    </div>
    
                    <div class="container">
                            <p class="h6 m-0 float-left mt-1 mb-0">Food</p>
                            <p class="m-0 float-right text-secondary mt-1 mb-0" style="font-size: .75rem">$75 Remaining</p>
                        <div class="container p-0 progress" style="height: 1.5rem">
                            <div class="progress-bar progress-bar-striped custom-purple" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                <span class="justify-content-left position-absolute p-1">$25 of $100</span>
                            </div>
                        </div>
                    </div> -->
    
                <div class="container mt-1">
                    <button class="border-0 transparent" id="addBudget">
                        <i class="h6 fas fa-plus-circle"></i> Add Budget
                    </button>
                </div>
    <!-- Budget Graphs End -->
    <!-- Expense Table Start -->
                <div class="container mt-3">
                    <div class="table-responsive">
                        <table class="table table-sm table-striped table-hover mb-0">
                            <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Vendor</th>
                                <th scope="col">Budget</th>
                                <th scope="col">Item</th>
                                <th scope="col">Price</th>
                            </tr>
                            </thead>
                            <tbody class="expenseSection">
                            
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="container mt-1" id="addExpense">
                        <i class="h6 fas fa-plus-circle"></i> Add Expense
                    </div>
    <!-- Expense Table Start-->
    
    </div>
    `;
    
    $('body').append(mainPage);
    createDoughnutChart();
    $('#addBudget').on('click',budgetLimiter);
    $('#budgetSubmit').on('click',createBudget);
    $('#addExpense').on('click',()=>{
        $('#createExpenseModal').modal('show');
    });
    $('#expenseSubmit').on('click',createExpense);
}

/***************************************************************************************************
 * Budget limiter
 */
//function checks if the maximum amount of budgets has been reached

function budgetLimiter(){
    if(initialCheck.budgetBarCount < 6){
        $('#createBudgetModal').modal('show')
    } else {
        $('#budgetLimitModal').modal('show')
    }
}

/***************************************************************************************************
 * Update DOM with main page
 */
//function runs after login and updates the DOM with contents of the main page
function handleLoggedStatus(data){
    console.log('handling login');
    if(data.loggedin){
        console.log('Logged in successful');
        loadMainPage();
        getData();
    } else {
        console.log('Logged in failed');
    }
}

/***************************************************************************************************
 * Add budget
 */
//function creates budget and adds to budget section
function createBudget(options) {
        console.log('initial options', options);

        if(!options){
            options = {
            margin: 'mt-1',
            budgetName: null,
            budgetAmount: null,
            budgetSpent: null,
            budgetRemaining: null,
            ariaValueNow: null,
            ariaValueMax: null,
            width: null
            };
        }

        console.log('new options', options);

        if(initialCheck.budget){
            options.margin = 'mt-3'
            $('.initial-budget').empty();
            initialCheck.budget = false;
        }

        options.budgetName = $("input.budget[name=budgetName]").val();
        options.budgetAmount = $("input.budget[name=budgetAmount]").val();
        options.budgetSpent = 25;
        options.budgetRemaining = options.budgetAmount - options.budgetSpent;
        options.ariaValueNow = 25;
        options.ariaValueMax = 100;
        options.width = options.ariaValueNow / options.ariaValueMax * 100;

        console.log('updated options', options);

        let budget = `
            <div class="container">
                <p class="h6 m-0 float-left ${options.margin} mb-0">${options.budgetName}</p>
                <p class="m-0 float-right text-secondary ${options.margin} mb-0" style="font-size: .75rem">$${options.budgetRemaining} Remaining</p>
                <div class="container p-0 progress" style="height: 1.5rem">
                    <div class="progress-bar progress-bar-striped custom-red" role="progressbar" style="width: ${options.width}%" aria-valuenow="${options.ariaValueNow}" aria-valuemin="20" aria-valuemax="${options.ariaValueMax}">
                        <span class="justify-content-left position-absolute p-1">$${options.budgetSpent} of $${options.budgetAmount}</span>
                    </div>
                </div>
            </div>`;

        console.log('budget html: ', budget);

        $('div.budgetSection').append(budget);


        initialCheck.budgetBarCount++;
    
    $('#createBudgetModal').modal('hide');
    budgetObject.labels.push(options.budgetName);
    budgetObject.values.push(options.budgetAmount);

    createDoughnutChart(budgetObject);
}

/***************************************************************************************************
 * Add expense
 */
//function creates expense to add to the expense area
function createExpense(options) {
 
    if(!options){   
        options= {dates: null,
        vendor: null,
        item: null,
        budget: null,
        price: null
    }};

    console.log('options: ', options);

    options.date = $("input.expense[name=date]").val();
    console.log('options.date', options.date);

    options.vendor = $("input.expense[name=vendor]").val();
    console.log('options.vendor', options.vendor);

    options.item = $("input.expense[name=item]").val();
    console.log('options.item', options.item);

    options.budget = $("input.expense[name=budget]").val();
    console.log('options.budget', options.budget);

    options.price = $("input.expense[name=price]").val();
    console.log('options.price', options.price);
 
console.log('options: ', options);

$.ajax({
    url: 'http://localhost:3050/submitExpense',
    cache: false,
    data: {
        date: options.date,
        item: options.item,
        price: options.price,
        vendor: options.vendor,
        username: initialCheck.currentUser,
        budget: options.budget
    },
    method: 'post',
    dataType: 'json'
});
         console.log('updated options', options);
         var optionsArray = [];
         optionsArray.push(options);

         loadExpense(optionsArray);
     $('#createExpenseModal').modal('hide');
 }


 /***************************************************************************************************
 * Load expenses
 */
//function that loads expenses

function loadExpense(expenseArray){
    for(let i = 0; i < expenseArray.length; i++){

        let expense = `
            <tr>
                <td>${expenseArray[i].date}</td>
                <td>${expenseArray[i].vendor}</td>
                <td>${expenseArray[i].budget}</td>
                <td>${expenseArray[i].item}</td>
                <td>${expenseArray[i].price}</td>
            </tr>
     `;

     initialCheck.expenseRowCount++;
     
     if(initialCheck.expenseRowCount < 10){
        $('tbody.expenseSection').append(expense);
    } else {
        return console.log('show next 10');
    }
    }
}
/***************************************************************************************************
 * Get Data
 */
//function gets all budget and expense data related to the current user

function getData(){

    $.ajax({
        url: 'http://localhost:3050/getData',
        cache: false,
        data: {
            username: initialCheck.currentUser
        },
        method: 'post',
        dataType: 'json'
    });
}