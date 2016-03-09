Meteor.startup(function(){
	defaultTemplate='a';
	TestRunning=true;
	var testing=true;
	if(testing){
		Tests.remove({});
		Templates.remove({});
		Sessions.remove({});

		var test= {
			templateData: [{name: 'a', weight: 5,successCriteria: 0.8},
			{name: 'c', weight: 2,successCriteria: 0.8},
			{name: 'b', weight: 3,successCriteria: 0.8}],
			components: [{type: 'id', name: 'feat0'},{type: 'id', name: 'feat1'}],
			duration: 30
		};
		Meteor.call('createTest',test,function(err,result){
			if(err)
				console.log(err);
			else{

			}
		});		
	}
});



Meteor.publish('test',function(){
	return Tests.find();
})
