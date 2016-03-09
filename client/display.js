Template.display.helpers({
	selectedView: function(){
		//take from session
		return Session.get('templateName');
	}
});