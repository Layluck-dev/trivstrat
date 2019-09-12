class Questions{
	
	//check if the difficultyFactor isn't smaller than 0 or greater than 100.
	constructor(df){
		if(df>0 && df<100){
			this.difficultyFactor = df;
		}else{
			this.difficultyFactor = 20;
		}
	}
	
	//ideally you'd import the questions from an external file, and you'd have more than 10 questions. But this is only a proof of concept.
	timer = [0, 0];
	questionKey = 0;
	questions = [	{q: "Wie heeft de telefoon uitgevonden?", a: "Alexander Graham Bell", b: "Albert Einstein", c: "Nikola Tesla", an: "A"},
					{q: "welke nagel groeit het snelst?", a: "Wijsvinger", b: "Middelvinger", c: "Ringvinger", an: "B"},
					{q: "Op welke temperatuur kookt water?", a: "99,8C", b: "100C", c: "100F", an: "B"},
					{q: "Wie heeft anitibiotica ontdekt?", a: "Marie Curie", b: "John Hoover", c: "Alexander Fleming", an: "C"},
					{q: "Wie heeft Julius Caesar, Macbeth en Hamlet geschreven?", a: "Chaikovski", b: "Isaac Arthur", c: "William Shakespeare", an: "C"},
					{q: "Wie heeft Lazarillo de Tormes geschreven?", a: "Onbekend", b: "Columbus", c: "Hernán Cortés", an: "C"},
					{q: "Wat slikte de krokodil in Peter Pan in?", a: "Koekepan", b: "Wekker", c: "Telefoon", an: "B"},
					{q: "Waar was Lope de Vega geboren?", a: "Portugal", b: "Spanje", c: "Mexico", an: "B"},
					{q: "Met wie is Diana Spencer getrouwd?", a: "Prins Charles", b: "George Bush", c: "Ivan Guille", an: "A"},
					{q: "Waar ligt Basel?", a: "Zwitserland", b: "Duitsland", c: "Ostenrijk", an: "A"}];
	
	
	//sets new random key.
	setNewKey(){
		this.temp = Math.round(Math.random()*(this.questions.length-1));
		
		//Make the same key is not egenerated twice in a row.
		while(this.temp == this.questionKey){
			this.temp = Math.round(Math.random()*(this.questions.length-1));
		}
		this.questionKey = this.temp;
	}
	
	//returns a random question.
	getRandQuestion(){
		this.setNewKey();
		
		return this.questions[this.questionKey];	
	}
	
	//sets the start timer.
	setTimer(){
		
		//set the first time key
		this.timer[0] = performance.now();
	}
	
	//checks the given answer and returns a score.
	checkAnswer(input){
		
		//set the second time key
		this.timer[1] = performance.now();
		
		if(this.questions[this.questionKey].an == input){
			return this.getScore();
		}else{
			return 0;
		}
	}
	
	
	//Score calculation formula:
	//Math.round(difficultyFactor*(Math.pow((( ΔT )/1000), -1))) OR 20*((ΔT/1000)^-1) rounded +1
	getScore(){
		return (Math.round(this.difficultyFactor*(Math.pow(((this.timer[1] - this.timer[0])/1000), -1)))+1);
	}
	//(t1 - t0)/1000                                        get the time difference (ΔT) and turn it from miliseconds into seconds (Δs)
	//Math.pow(((t1 - t0)/1000), -1)                        get the value of Δs^-1
	//20*(Math.pow(((t1 - t0)/1000), -1))                   multiply this value by 20
	//Math.round(20*(Math.pow(((t1 - t0)/1000), -1)))       round the the resulting value to nearest full number
	//(Math.round(20*(Math.pow(((t1 - t0)/1000), -1)))+1)   +1 to make sure the score is always higher than 0
}