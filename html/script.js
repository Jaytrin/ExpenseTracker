$(document).ready(initializeApp);

function initializeApp(){
    // createDoughnutChart(); run on chart page
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

function createDoughnutChart(){
    new Chart(document.getElementById("doughnut-chart"), {
        type: 'doughnut',
        data: {
          labels: ["Africa", "Asia", "Europe", "Latin America", "North America", "test"],
          datasets: [
            {
              label: "Population (millions)",
              borderWidth: [.5],
              backgroundColor: ["#8b7cf7", "#4285F4", "#0F9D58", "#F4B400", "#ff8c00", "#DB4437"],
              data: [1478,5267,2734,1184,3833,2888]
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
            text: 'Predicted world population (millions) in 2050'
          },
          legend: {
            display: false
         }
        }
    });
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
        
        var user = $("input.login[name=username]").val();
        var pass = $("input.login[name=password]").val();
        
        $.ajax({
            url: 'http://localhost:3050/login',
            cache: false,
            data: {
                username: user,
                password: pass
            },
            method: 'post',
            dataType: 'json'
        })}