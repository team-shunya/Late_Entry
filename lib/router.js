

Router.route('/', { //testPage
  name: 'display',
  template: 'display',
  action: function(){
    if(Meteor.isClient){
      var sessionId= Session.get('sessionId');
      if(sessionId){
        //expired or not //TODO


        //if expire session.clear()
      }
    }else{
      Meteor.call('createSession',function(err,sessionCredentials){
        Session.setPersistent(sessionCredentials);
        this.render(Session.get('templateName'));
      });
    }
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