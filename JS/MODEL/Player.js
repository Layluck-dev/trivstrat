class Player{

	isAlive = true;
	
	constructor(n, p, c){
		this.name = n;
		this.points = p;
		
		switch(c){
			case 0:
				this.colour = "#F00";
				break;
			case 1:
				this.colour = "#00F";
				break;
			case 2:
				this.colour = "#0F0";
				break;
			case 3:
				this.colour = "#EE0";
				break;
		}
	}
	
	setColour(c){
		this.colour = c;
	}
	
	setPoints(p){
		this.points = p;
	}
	
	updatePoints(p){
		this.points = this.points + p;
	}
	
	setLive(l){
		this.isAlive = l;
	}
	
	getColour(){
		return this.colour;
	}
	
	getPoints(){
		return this.points;
	}
	
	getName(){
		return this.name;
	}
	
	checkLive(){
		return this.isAlive;
	}
	
}