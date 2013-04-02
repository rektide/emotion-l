var emo= angular.module('emotional', []);
emo.provider("vocabService", {
	vocab: null,
	setVocalUrl: function(vocalUrl){
		var defer= $q.defer()
		$http.get(vocabUrl)
		  .success(function(data,status,headers,config){
			// convert to xml
			var parser= new DOMParser(),
			  xml= parse.parseFromString(data,"text/xml"),
			  vocab= ["happy","sad","angry"]
			this.setVocab(vocab)
			defer.resolve(vocab)
		  })
		  .error(function(data,status,headers,config){
			defer.reject("vocab load failed")
		  })
		return defer
	},
	setVocab: function(vocab){
		this.vocab= vocab
	},
	$get: function(){
		// hardcoded - "big6"
		return ["anger","disgust","fear","happiness","sadness","surprise"]
	}
});
emo.controller("emotionalController", ["$log","$scope","vocabService", function($log,$scope,vocabService){
	$scope.vocab = vocabService
}]);
