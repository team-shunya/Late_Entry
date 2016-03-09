var counter=0;


Meteor.methods({
	createSession: function(){
		if(TestRunning===false){
			return {
				templateName: defaultTemplate
			}
		}else{
			var test= Tests.findOne({status:'running'});

			var templates= Templates.find({testId: test._id}).fetch();
			//logic

			templates.sort(function(a,b){
				return a.currentWeight>b.currentWeight;
			});

			function resetWeight(){
				templates.forEach(function(t){
					Templates.update({_id: t._id},{$set: {currentWeight: t.weight}});
				})
			}

			var templateCount= templates.length;
			while(templates[counter].currentWeight==0){
				counter=(counter+1)%templateCount;
				if(templates[0].currentWeight===0){
					resetWeight();
				}
			}
			var updatedTemplateName=templates[counter].name;
			Templates.update({_id:templates[counter]._id},{$set:{currentWeight:templates[counter].currentWeight-1},$inc: {currentUsers: 1}});
			counter=(counter+1)%templateCount;


			var sessionCredentials= {
				testId: test._id,
				sessionId: Meteor.random(),
				expireTime: test.endTime,
				templateName: updatedTemplateName, 
				testRunning: true
			};

			Session.insert(sessionCredentials);

			return sessionCredentials;			
		}
	},
	createTest: function(testData){

		/*
			{
				templateData: [{name, weight,successCriteria}]
				[component],
				duration: minutes
			}

		*/

		var test= {
			status: 'running',
			startTime: new Date(),
			endTime: moment().add(testData.duration,'minutes').toDate(),
			components: testData.components
		};

		var testId=Tests.insert(test);


		var idList=[];
		testData.templateData.forEach(function(t){
			var id=Templates.insert({
				name: t.name,
				weight: t.weight,
				successCriteria: t.successCriteria,
				testId:testId,

				currentWeight: t.weight,
				score: 0,
				currentUsers: 0,
				success: false
			});
			idList.push(id);
		});
		Tests.update({_id:testId},{$set:{templates:idList}});
	
	}

});