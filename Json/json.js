describe('Json stringify', function(){
	it('should stringify a json object', function(){
		var stringifiedObject = JSON.stringify({something: "value"});
		expect(stringifiedObject).toBe("{\"something\":\"value\"}")
	});
});