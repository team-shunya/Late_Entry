var counter=0;
var lock;

Meteor.methods({
	createSession: function(previousId){


		console.log('session method');
		
		if(TestRunning===false){
			return {
				templateName: defaultTemplate
			}
		}else{

			if(Sessions.findOne({_id: previousId}))
				return;

			console.log('creating session');

			var test= Tests.findOne({status:'running'});

			var templates= Templates.find({testId: test._id}).fetch();
			//logic
/*			function selectionSort(A)
			{
				var n=A.length;
				for(var i=0;i<n;i++)
				{
					var max_i=i;
					for(var j=i+1;j<n;j++)
					{
						if(A[max_i].currentWeight<A[j].currentWeight)
						{
							max_i=j;
						}
					}
					var temp=A[max_i];
					A[max_i]=A[j];
					A[j]=temp;
				}
			}*/


			// templates.sort(function(a,b){
			// 	return a.currentWeight<b.currentWeight;
			// });
			selectionSort(templates);
			console.log(templates);
			console.log("***********************");
			function resetWeight(){
				templates.forEach(function(t){
					Templates.update({_id: t._id},{$set: {currentWeight: t.weight}});
				})
			}

			var templateCount= templates.length;
			console.log(counter);
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
				expireTime: test.endTime,
				templateName: updatedTemplateName, 
				testRunning: true
			};

			var id=Sessions.insert(sessionCredentials);
			sessionCredentials._id=id;

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