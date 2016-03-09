Session= new Mongo.Collection('session');

/*
{
	testId: 
	sessionId: 
	expireTime: 
	templateId:
	//data
}
*/


Test= new Mongo.Collection('test');

/*
{
	testId:
	startTime:
	endTime:
	templates: [{name: , weight: 1to10, id}]
	components: [{type: class/id, name}],}
*/

TemplateResults= new Mongo.Collection('templateResult');

/*
	

*/





