class ModeManager{
	
	//number of pages this game uses, should be const but throws exceptions
	/*const*/ TOTAL = 5;
	/*const*/ MAX_PLAYERS = 4;
	/*const*/ MIN_PLAYERS = 2;
	players = 2;
	turn = 0;
	firstVisit = true;
	
	//check if the page fits within the limits, otherwise warns via console and set the page to 1.
	constructor(p) {
		if(p > this.TOTAL || p < (this.TOTAL-this.TOTAL+1)){
			this.page = 1;
			console.warn("Invalid page number was given, set page number to 1.");
		}else{
			this.page = p;
		}
	}
	
	getPage(){
		return this.page;
	}
	
	getPlayers(){
		return this.players;
	}
	
	getTurn(){
		return this.turn;
	}
	
	getMAX_PLAYERS(){
		return this.MAX_PLAYERS;
	}
	
	getMIN_PLAYERS(){
		return this.MIN_PLAYERS;
	}
	
	getFirstVisit(){
		return this.firstVisit;
	}
	
	setFirstVisit(bool){
		this.firstVisit = bool;
	}
	
	//check if the given number fits within limits, otherwise don't set it.
	setPlayers(nr){
		if(nr <= this.MAX_PLAYERS && nr >= this.MIN_PLAYERS) this.players = nr;
	}
	
	//check if the next page isn't out of bounds.
	nextPage(){
		((this.page+1) < this.TOTAL) && this.page++;
	}
	
	//check if the previous page isn't out of bounds
	previousPage(){
		((this.page-1) > (this.TOTAL-this.TOTAL)) && this.page--;
	}
	
	//find the next turn
	nextTurn(pd){
		
		//In case a compatible next turn cannot be found we still break the loop so that we do not encounter any infinite loops.
		this.infiniBreak = 0;
		
		while(this.infiniBreak < 100){
			this.turn++;
			this.infiniBreak++;
			
			//If we reach the maximum amount of players set turn back to 0. -1 to account for the difference between the 0 index array and actual number of players.
			//Every time we reach the max we complete a round in which everyone has had one turn and we switch gamestates (switching between page 3 and 4).
			if(this.turn > (this.players-1)){
				this.turn = 0;
				
				if(this.page == 3){
					this.nextPage();
					return this.page;
				}else if(this.page == 4){
					this.previousPage();
					return this.page;
				}
			}
			
			//if we find the next player and the player is alive then we break the loop and thus set the turn.
			if(pd[this.turn].checkLive()){
				break;
			}
		}
	}
	
}