var previousScore={};

var scoreSequence=[];
var distributionSequence=[];

totalUsers=0;


function getTest(){
	return Tests.findOne({latest: true})._id;
}

Template.analytics.helpers({
	template: function(){
		return Templates.find({testId: getTest() });
	},
	successStatus: function(){
		return this.click>Tests.findOne({latest: true}).success?'true':'false';
	},
	leading: function(){
		var flag=true;
		var self=this;
		var templates=Templates.find({testId: getTest()});
		var score=this.score;
		templates.forEach(function(t){
			if(t.score>score)
				flag=false;
		});

		if(flag)
			return true;
	}
});

Template.analytics.onRendered(function(){
	var ctx = document.getElementById("scoringChart").getContext("2d");

	
	var templates=Templates.find({testId: getTest()}).fetch();


	var counter=0;
	var blueprint= [
		{
				label: 'A',
		    fillColor: "rgba(220,220,220,0.2)",
		    strokeColor: "rgba(220,220,220,1)",
		    pointColor: "rgba(220,220,220,1)",
		    pointStrokeColor: "#fff",
		    pointHighlightFill: "#fff",
		    pointHighlightStroke: "rgba(220,220,220,1)",
		    data: []
		},
		{
			label: 'B',
		    fillColor: "rgba(151,187,205,0.2)",
		    strokeColor: "rgba(151,187,205,1)",
		    pointColor: "rgba(151,187,205,1)",
		    pointStrokeColor: "#fff",
		    pointHighlightFill: "#fff",
		    pointHighlightStroke: "rgba(151,187,205,1)",
		    data: []
		},
		{
			'label': 'C',
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
		labels: [1],
    datasets: [
       
    ]
	};

	templates.forEach(function(t){
		var dataset=JSON.parse(JSON.stringify(blueprint[counter]));
		counter= (counter+1)%3;   
		dataset.data.push(t.score);
		dataset.label=t.name;
		data.datasets.push(dataset);
		scoreSequence.push(t.name);
		previousScore[t.name]=t.score;
	});

 //data.datasets=blueprint;
	myLineChart = new Chart(ctx).Line(data);
	//myLineChart.addData([40, 60], "August");

	//score chart initialized 


	var ctx2 = document.getElementById("distribution").getContext("2d");
	var counter2=0;
	var data2=[];
	var blueprint2=[
		{
				label: 'A',
		    color:"#F7464A",
		    highlight: "#FF5A5E",
		    value: 1
		},
		{
				label: 'B',
		    color: "#46BFBD",
		    highlight: "#5AD3D1",
		    value: 0
		},
		{
		    label: 'C',
		    color: "#FDB45C",
		    highlight: "#FFC870",
		    value: 0
		}
	];

	templates.forEach(function(t){
		var d=JSON.parse(JSON.stringify(blueprint2[counter2])); 
		d.value=t.currentUsers;
		d.label=t.name;
		data2.push(d);
		distributionSequence.push(t.name);
		counter2=(counter2+1)%3;
	});

	console.log(data2)


	myPieChart = new Chart(ctx2).Doughnut(data2);
	//myPieChart.segments[1].value = 10;
// Would update the first dataset's value of 'Green' to be 10
//myPieChart.update();

	var counter3=2;
	Watchdog=Templates.find({testId: getTest()}).observe({
		changed: function(newDoc,old){
			console.log('old',old,'new',newDoc);

			//distribution

			if(newDoc.currentUsers>old.currentUsers){
				console.log('updating distribution');


				for(var i=0; i<distributionSequence.length;i++){
					if(distributionSequence[i]===old.name){
						myPieChart.segments[i].value=newDoc.currentUsers;
						myPieChart.update();
					}
				}
			}


			if(newDoc.score===previousScore[old.name])
				return;
			else{
				var update=[];

				for (var j=0; j<scoreSequence.length; j++){
					if(scoreSequence[j]===old.name)
						update.push(newDoc.score);
					else
						update.push(previousScore[scoreSequence[j]]);
				}
				myLineChart.addData(update,counter3);
				counter3++;

			}


		}
	});


});


Template.analytics.onDestroyed(function(){
	Watchdog.stop();
});
