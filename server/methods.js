Meteor.methods({
	createSession: function(){
		if(TestRunning===false)
			return {
				template: 'a'
			}
	},

});