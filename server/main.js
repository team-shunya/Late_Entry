Meteor.startup(function(){
	defaultTemplate='a';
	TestRunning=true;
	AutoWeight=false;
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
			duration: 2,
			success: 0.6
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
});



SyncedCron.add({
  name: 'Tests job',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 2 minutes');
  },
  job: function() {



      var test=Tests.findOne({status:'running'});
      var t= (new Date()).valueOf();
      if(t>(test.endTime).valueOf()){
      	 Tests.update({status:'running'},{$set:{status:'stopped'}});

      	 var templates=Templates.find({testId: test._id}).fetch();

      	 var winner=templates[0];
      	 templates.forEach(function(t){
      	 	if(t.score>winner.score)
      	 		winner=t; //reference
      	 });

      	 Tests.update({_id: test._id},{$set: {winner: winner.name}});

      		//update success for teml
      		var success=test.success;
      		templates.forEach(function(t){
      			var ratio=t.click/Sessions.find({testId:test._id,templateName:t.name}).count();
						if(ratio>success)
							Templates.update({_id:t._id},{$set:{success:true}});      			
      		});	

      		if(AutoWeight){
      			//insert new test with inremented weight for winner.
      		}
      }

  }
});

SyncedCron.start();

