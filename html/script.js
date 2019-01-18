$(document).ready(initializeApp);

function initializeApp(){
    createDoughnutChart();
}



/***************************************************************************************************
 * Create Pie Chart
 * 
 * 
 */
//function to create labels, background color and data.

function createDoughnutChart(){
    new Chart(document.getElementById("doughnut-chart"), {
        type: 'doughnut',
        data: {
          labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
          datasets: [
            {
              label: "Population (millions)",
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
              data: [2478,5267,734,784,433]
            }
          ]
        },
        options: {
            plugins: {
                labels: {
                  render: 'percentage',
                  fontColor: 'white',
                  precision: 0
                }
              },
          title: {
            display: true,
            text: 'Predicted world population (millions) in 2050'
          },
          legend: {
            display: false
         }
        }
    });
}