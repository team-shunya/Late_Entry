var counter=0;
var lock;

  Array.prototype.mergeSort = mergeSort;

  function mergeSort(compare) {

    var length = this.length,
        middle = Math.floor(length / 2);

    if (!compare) {
      compare = function(left, right) {
        if (left < right)
          return -1;
        if (left == right)
          return 0;
        else
          return 1;
      };
    }

    if (length < 2)
      return this;

    return merge(
      this.slice(0, middle).mergeSort(compare),
      this.slice(middle, length).mergeSort(compare),
      compare
    );
  }

  function merge(left, right, compare) {

    var result = [];

    while (left.length > 0 || right.length > 0) {
      if (left.length > 0 && right.length > 0) {
        if (compare(left[0], right[0]) <= 0) {
          result.push(left[0]);
          left = left.slice(1);
        }
        else {
          result.push(right[0]);
          right = right.slice(1);
        }
      }
      else if (left.length > 0) {
        result.push(left[0]);
        left = left.slice(1);
      }
      else if (right.length > 0) {
        result.push(right[0]);
        right = right.slice(1);
      }
    }
    return result;
  }


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


			//stable kro
			templates.sort(function(a,b){
				return a.currentWeight<b.currentWeight;
			});
		/*	templates=templates.mergeSort(function(left, right){
			  return left.currentWeight < right.currentWeight;
			});*/
			console.log(templates);
			console.log("***********************");
			function resetWeight(){
				templates.forEach(function(t){
					Templates.update({_id: t._id},{$set: {currentWeight: t.weight}});
				});
			}

			var templateCount= templates.length;
			console.log(counter);
			while(templates[counter].currentWeight==0){
				counter=(counter+1)%templateCount;
				if(templates[0].currentWeight===0){
					console.log('weight reset');
					resetWeight();
					break;
				}
			}

			var templates= Templates.find({testId: test._id}).fetch();


			//stable kro
			templates.sort(function(a,b){
				return a.currentWeight<b.currentWeight;
			});


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
			components: testData.components,
			latest: true,
			scoring:{
				click:10,
				hover:1
			},
			success: testData.success
		};

		var testId=Tests.insert(test);


		var idList=[];
		testData.templateData.forEach(function(t){
			var id=Templates.insert({
				name: t.name,
				weight: t.weight,
				successCriteria: t.successCriteria,
				testId:testId,
				click:0,
				hover: 0,
				currentWeight: t.weight,
				score: 0,
				currentUsers: 0,
				success: false
			});
			idList.push(id);
		});
		Tests.update({_id:testId},{$set:{templates:idList}});
	
	},
	"updateClickScore":function(obj){
		// console.log(obj);
		Templates.update({name:obj.templateName},{$inc:{click:1,score:obj.clickScore}});
	},
	"updateHoverScore":function(obj){
		// console.log(obj);
		Templates.update({name:obj.templateName},{$inc:{hover:1,score:obj.hoverScore}});
	}


});
