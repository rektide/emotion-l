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
	for(var i in $scope.vocabs){
		var voc= $scope.vocabs[i]
		$scope.vocabsById[$scope.vocabs[i].id]= $scope.vocabs[i]
		voc.i= parseInt(i)
	}
	// TODO: configurable in app
	$scope.colors= {
		category: "rgb(80,0,0)",
		dimension: "rgb(0,80,0)",
		appraisal: "rgb(0,0,80)"
	}
	$scope.background= {
		false: "rgb(255,255,170)",
		true: "rgb(212,212,212)"
	}
	$scope.vocab= vocabService
	$scope.e= function(v,i){
		if(v instanceof Array){
			i= v[1]
			v= v[0]
		}
		return $scope.vocabs[v].items[i]
	}
	$scope.$watch("active",function(a,b){
		console.log("active",a,"|",b)
	})
	$scope.addVoc= "big6"
	$scope.isActive= function(e,v){
		v= v||$scope.addVoc
		if(!v)
			return false
		var cur= $scope.vocabsById[v]
		if(!cur){
			console.warn("bad isActive ask, no addVoc")
			return false
		}
		if(!isNaN(e) && e !== null && e !== undefined){
			for(var i in $scope.active){
				var a= $scope.active[i]
				if(a[0] == v && a[1] == e){
					return true
				}
			}
		}else{
			var needs= $scope.vocabsById[v].items.length
			for(var i in $scope.active){
				var a= $scope.active[i]
				if(a[0] == v)
					--needs
			}
			return needs <= 0
		}
		return false
	}
}]);
