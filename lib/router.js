Router.route('/', { //testPage
  name: 'landing',
  template: 'landingPage',
  onBeforeAction: function(){

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