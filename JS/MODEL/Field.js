class Field{
	
	//create two update return arrays for the GUI to use for visual updates.
	fieldUpdateReturn = new Array();
	collisionUpdateReturn = new Array();
	
	//create a field with given size and set all squares to #FFF (white).
	constructor(size){
		this.matrix = new Array(size);
		
		for(this.i=0; this.i<15; this.i++){
			this.matrix[this.i] = new Array(size);
		
			for(this.f=0; this.f<15; this.f++){
				this.matrix[this.i][this.f] = "#FFF";
			}
		}
	}
	
	//returns the contents of the matrix (field).
	getMatrix(){
		return this.matrix;
	}
	
	//returns the size of the matrix (single dimension, default 15, not 2d size of 225 (15*15)).
	getSize(){
		return this.matrix.length;
	}
	
	//sets a given square to a given colour.
	setSquare(id, colour){
		this.matrix[id[0]][id[1]] = colour;
	}
	
	//prepare the initial field by given each player one start-up square.
	prepareField(pd){
		if(pd.length == 2){			
			this.matrix[7][1] = pd[0].getColour();
			this.matrix[7][13] = pd[1].getColour();
		}else if(pd.length == 3){
			this.matrix[1][1] = pd[0].getColour();
			this.matrix[1][13] = pd[1].getColour();
			this.matrix[13][7] = pd[2].getColour();
		}else{
			this.matrix[7][1] = pd[0].getColour();
			this.matrix[7][13] = pd[1].getColour();
			this.matrix[13][7] = pd[2].getColour();
			this.matrix[1][7] = pd[3].getColour();
		}
	}
	
	//update 'collision' data and return to main,
	//using i, f, selected player colour (pc) by read playerColour(), player data (pd) and turn.
	readCollision(i, f, pc, pd, turn){
		
		if(this.matrix[i][f] == pd[turn].getColour()){
			
			//check if the vertical axis exists,
			//notice there is only a check performed on the horizontal axis as checking for "field[i-1][f]" throws an undefined error since the 'f' axis doesn't exist.
			if(typeof this.matrix[i-1] != "undefined"){
				if(this.matrix[i-1][f] != pc){
					this.collisionUpdateReturn.push("#" + (i-1) + "-" + f);
				}
			}
			
			if(typeof this.matrix[i+1] != "undefined"){
				if(this.matrix[i+1][f] != pc){
					this.collisionUpdateReturn.push("#" + (i+1) + "-" + f);
				}
			}
			
			//check horizontally if the field exists.
			if(typeof this.matrix[i][f-1] != "undefined"){
				if(this.matrix[i][f-1] != pc){
					this.collisionUpdateReturn.push("#" + i + "-" + (f-1));
				}
			}
			
			if(typeof this.matrix[i][f+1] != "undefined"){
				if(this.matrix[i][f+1] != pc){
					this.collisionUpdateReturn.push("#" + i + "-" + (f+1));
				}
			}
		}				
	}
	
	
	readPlayingField(pd, turn){
		
		//reset Arrays to prevent old data from being stored beyond intention and to avoid memory leaks.
		this.fieldUpdateReturn.length = 0;
		this.collisionUpdateReturn.length = 0;
		
		
		//Loop through all squares in the matrix.
		for(this.i=0; this.i<this.matrix.length; this.i++){
			for(this.f=0; this.f<this.matrix.length; this.f++){
				
				//Check if they are white ("#FFF"), if not check if the colour matches a player's.
				if(this.matrix[this.i][this.f] != "#FFF"){
					for(this.n=0; this.n<pd.length; this.n++){
						
						//If a colour matches a player's push it to the update array.
						if(this.matrix[this.i][this.f] == pd[this.n].getColour()){
							this.fieldUpdateReturn.push([this.i, this.f, pd[this.n].getColour()]);
							this.readCollision(this.i, this.f, pd[this.n].getColour(), pd, turn);
						}else{
							//reset unfound colour to white.
							this.matrix[this.i][this.f] == "#FFF";
						}
					}
				}
				
			}
		}
		
		//return all visual and selectable square data.
		return [this.fieldUpdateReturn, this.collisionUpdateReturn];
	}
	
	//check if players are still alive.
	checkForPlayers(pd){
		
		this.counter = 0;
		
		//for each player check the matrix.
		for(this.i=0; this.i<pd.length; this.i++){
			
			//temporarily kill the player being checked.
			pd[this.i].setLive(false);
			
			//loop through all the mtrix fields.
			for(this.f=0; this.f<this.matrix.length; this.f++){
				
				//if a player's colour is found, 'revive' the player
				if (this.matrix[this.f].includes(pd[this.i].getColour())){
					pd[this.i].setLive(true);
				}
			}	
		}
		
		//count the number of live players.
		for(this.i=0; this.i<pd.length; this.i++){
			(pd[this.i].checkLive()) && this.counter++;
		}
		
		//return false if there is more than a single player.
		if(this.counter > 1){
			return false;
		}else{
			return true;
		}
	}
}