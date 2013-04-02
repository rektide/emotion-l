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
	$scope.active= []
	// TODO: provide from vocabService
	$scope.vocabs= [{
		url:"http://www.w3.org/TR/emotion-voc/xml#big6",
		id:"big6",
		type:"category",
		items:["anger","disgust","fear","happiness","sadness","surprise"]
	  }, {
		url:"http://www.w3.org/TR/emotion-voc/xml#everyday-categories",
		id:"everyday-categories",
		type:"category",
		items:["affectionate","afraid","amused","angry","bored","confident","content","disappointed","excited","happy","interested","loving","pleased","relaxed","sad","satisfied","worried"]
	  }, {
		url:"http://www.w3.org/TR/emotion-voc/xml#big6",
		id:"fsre-dimensions",
		type:"dimension",
		items:["valence","potency","arousal","unpredictability"]
	  }, {
		url:"http://www.w3.org/TR/emotion-voc/xml#ooc-appraisals",
		id:"ooc-appraisals",
		type:"appraisal",
		items:["desirability","praiseworthiness","appealingness","desirability-for-other","deservingness","liking","likelihood","effort","strength-of-identification","expectation-of-deviation","familiarity"]
	  }]
	// i'd like to not build this data structure but instead use two ng-repeats, the outter w/o a tag, but don't think angularjs knows how to. pregen this index instead:
	$scope.vocabsById= {}
	for(var i in $scope.vocabs)
		$scope.vocabsById[$scope.vocabs[i].id]= $scope.vocabs[i]
	// TODO: configurable in app
	$scope.colors= {
		category: "rgb(50,0,0)",
		dimension: "rgb(0,50,0)",
		appraisal: "rgb(0,0,50)"
	}
	$scope.vocab= vocabService
	$scope.$watch("addItem", function(nv, ov){
		var voc= $scope.vocabsById[$scope.addVoc]
		console.log("ITEM",nv,ov,$scope.addVoc,voc)	
	})
}]);
