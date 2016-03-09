

Router.route('/', { //testPage
  name: 'display',
  template: 'display',
  onBeforeAction: function(){
    if(Meteor.isClient){
      var sessionId= Session.get('sessionId');
      if(sessionId){
        //expired or not


        //if expire session.clear()
      }
    }else{
      Meteor.call('createSession',function(err,sessionCredentials){
        
      });
    }
  },
  action: function(){
  	//check if session exists
  }
});












Router.route('/success', { //success page
  name: 'success',
  template: 'success',
  action: function(){
  		this.render();
  }
});


Router.route('/admin', {
  name: 'admin',
  template: 'admin',
  action: function(){
  		this.render();
  }
});

// For tests only
Router.route('/xa', {
  name: 'xa',
  template: 'xa',
  action: function() {
    this.render();
  }
});

Router.route('/xb', {
  name: 'xb',
  template: 'xb',
  action: function() {
    this.render();
  }
});

Router.route('/xc', {
  name: 'xc',
  template: 'xc',
  action: function() {
    this.render();
  }
});