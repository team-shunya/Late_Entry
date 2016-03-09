Router.route('/',{
  name: 'landing',
  'template': 'landing',
  action: function(){
    this.render();
  }
})

Router.route('/analytics',{
  name: 'analytics',
  waitOn: function(){
    return Meteor.subscribe('test');
  },
  'template': 'analytics',
  action: function(){
    this.render();
  }
})

Router.route('/display', { //testPage
  name: 'display',
  template: 'display',
  onBeforeAction: function(){
    //this.state.set('session',null);
    this.next();
  },
  action: function(){
    var self=this;
    if(Meteor.isClient){
      var previousId= Session.get('_id');
      console.log('previousId',previousId);
      Meteor.call('createSession',previousId,function(err,sessionCredentials){
        Session.setPersistent(sessionCredentials);
        self.render();
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

// For tests only
Router.route('/a', {
  name: 'a',
  template: 'a',
  action: function() {
    this.render();
  }
});

Router.route('/b', {
  name: 'b',
  template: 'b',
  action: function() {
    this.render();
  }
});

Router.route('/c', {
  name: 'c',
  template: 'c',
  action: function() {
    this.render();
  }
});