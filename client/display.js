Template.display.helpers({
	selectedView: function(){
		//take from session
		return Session.get('templateName');
	}
});

Template.display.onRendered(function(){
	var clickCounter=0;
	var test=Tests.findOne({_id:Session.get('testId')});
	console.log(test._id);
	testComponents=test.components;
	var identifiers=[];
	testComponents.forEach(function(component){
		var componentIdentifier="";
		if(component.type=="id")
			componentIdentifier+="#";
		else
			componentIdentifier+=".";
		componentIdentifier+=component.name;
		identifiers.push(componentIdentifier);
	});
	console.log(identifiers);
	identifiers.forEach(function(identifier){
		$(identifier).on('click',function(e){
			e.stopPropagation();
			 /*if (e.target === this)
    			return;*/
			Meteor.call('updateClickScore',{testId:test.testId,templateName:Session.get('templateName'),clickScore:test.scoring.click},function(err,result){
				if(err)
					console.log(err);
				else
					console.log('ok');
				// else
				// 	console.log('Yuss!');
			});
		});
		$(identifier).on({
		    mouseover: function() {
		        // set the variable to the current time
		        timer = Date.now();
		    },
		    mouseleave: function() {
		        // get the difference
		        timer = Date.now() - timer;  
		         console.log( parseFloat(timer/1000) + " seconds");
		         timer=parseFloat(timer/1000);
		         if(timer>=1)
		         	Meteor.call('updateHoverScore',{testId:test.testId,templateName:Session.get('templateName'),hoverScore:test.scoring.hover},function(err,result){
		         		if(err)
		         			console.log(err);
		         		// else
		         		// 	console.log('Yuss!');
		         	});
		        timer = null;        
		}
});
	});
});