var previousScore={};


function getTest(){
	return Tests.findOne({latest: true})._id;
}

Template.analytics.helpers({
	template: function(){
		return Templates.find({testId: getTest() });
	},
	successStatus: function(){
		return this.click>Tests.findOne({latest: true}).success?'true':'false';
	}
});

Template.analytics.onRendered(function(){
	var ctx = document.getElementById("scoringChart").getContext("2d");

	
	var templates=Templates.find({testId: getTest()}).fetch();


	var counter=0;
	var blueprint= [
		{
		    label: "My First dataset",
		    fillColor: "rgba(220,220,220,0.2)",
		    strokeColor: "rgba(220,220,220,1)",
		    pointColor: "rgba(220,220,220,1)",
		    pointStrokeColor: "#fff",
		    pointHighlightFill: "#fff",
		    pointHighlightStroke: "rgba(220,220,220,1)",
		    data: []
		},
		{
		    label: "My Second dataset",
		    fillColor: "rgba(151,187,205,0.2)",
		    strokeColor: "rgba(151,187,205,1)",
		    pointColor: "rgba(151,187,205,1)",
		    pointStrokeColor: "#fff",
		    pointHighlightFill: "#fff",
		    pointHighlightStroke: "rgba(151,187,205,1)",
		    data: []
		},
		{
		    label: "My Second dataset",
		    fillColor: "rgba(151,187,205,0.2)",
		    strokeColor: "rgba(151,187,205,1)",
		    pointColor: "rgba(151,187,205,1)",
		    pointStrokeColor: "#fff",
		    pointHighlightFill: "#fff",
		    pointHighlightStroke: "rgba(151,187,205,1)",
		    data: []
		}
	];

	var data = {
    datasets: [
       
    ]
	};

	templates.forEach(function(t){
		var dataset=JSON.parse(JSON.stringify(blueprint[counter]));
		counter= (counter+1)%3;   
		dataset.data.push(t.score);
		dataset.label=t.name;
		data.datasets.push(dataset)
		previousScore[t.name]=t.score;
	});


	var myLineChart = new Chart(ctx).Line(data);

	//score chart initialized 


	var ctx2 = document.getElementById("distribution").getContext("2d");


	
});

