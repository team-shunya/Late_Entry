Sessions= new Mongo.Collection('session');

/*
{
	testId: 
	sessionId: _id ! 
	expireTime: 
	templateName:
	//data

}
*/


Tests= new Mongo.Collection('test');

/*
{
	testId://_id
	status: running/stopped // only one can be running!
	startTime:
	endTime:
	templates: [templateId],
	scoring:{
		click,hover
	}
	components: [{type: class/id, name}],
	scoring: {
		click, hover
	}
	success: min clicks
	latest: true/false
	winner: 
*/

Templates= new Mongo.Collection('templates');

/*
templateId:, _id!

successCriteria:ratio,
currentWeight: initialize same as weiht
	name:,
	score:, init 0		
	weight: 1 to 10,
	testId:,
	click:,
	hover:,
	currentUsers: initialize 0
	success init false,
	click: 
*/ 





