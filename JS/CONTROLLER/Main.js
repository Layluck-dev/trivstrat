$(document).ready(function(){	
	
	//Array to hold player instances after selection.
	var playerData = new Array();
	
	//temporary and toggle variables.
	var tempName = new Array(4);
	var tempPage = 0;
	var answered = false;
	var tempScore = 0;
	
	//initiate mode manager to hanlde pages and turns.
	//different numbers allows for start up on different pages.
	let mm = new ModeManager(1);
	
	//initiate the GUI and display the corresponding screen.
	let screen = new GUI();
	findScreen();
	
	//initiate the playingfield/board with a size of 15 by 15 squares.
	//ideally players could select the size of the field.
	let board = new Field(15);
	
	//initiate the questions instance.
	//the difficulty can be changed (0 hardest, 100 easiest).
	let trivia = new Questions(20);
	
	//find what screen to go to next.
	function findScreen(gameOver){
		
		//if gameOver is undefined just conntinue as normal.
		if(typeof gameOver == "undefined"){
			
			switch(mm.getPage()){
				case 1:
					screen.displayIntro();
					break;
				case 2:
					screen.displayPlayerSelect(mm.getPlayers(), tempName);
					break;
				case 3:
					screen.displayGameScreen(playerData, board.getSize(), mm.getTurn());
					
					//Make sure that the field is only prepared once.
					if(mm.getFirstVisit()){
						board.prepareField(playerData);
						mm.setFirstVisit(false);
					}
					
					screen.updateGameScreen(board.readPlayingField(playerData, mm.getTurn()));
					screen.updatePTXT(mm.getPage(), playerData, mm.getTurn(), trivia);
					break;
				case 4:
					screen.displayTrivia(playerData, trivia, mm.getTurn());
					break;

			}
		
		//if gameOver is defined as true, display the final screen and find the last remaining player.
		}else if(gameOver == true){
			for(i=0; i<playerData.length; i++){
				if(playerData[i].checkLive()){
					screen.displayEndScreen(playerData[i]);
					break;
				}
			}
		}
		
		
	}
	
	//Handles the input from the trivia options.
	function handleInput(element, input){
		
		//get the score.
		tempScore = trivia.checkAnswer(input);
		
		//if the score is greater than 0 (correct), update the player score and the button colour (green).
		if(tempScore > 0){
			playerData[mm.getTurn()].updatePoints(tempScore);
			screen.updateTriviaButton(element, true);
		}else if(tempScore == 0){
			
			//if the score is 0 (incorrect), update only the button colour (red).
			screen.updateTriviaButton(element, false);
		}
	}
	
	
	//////////////////////////////////////////////////////////////////////action listeners in order of appearance/////////////////////////////////////////////////////////////
		
	//Go forward a screen.
	$(document).on("click", "#ContinueArrow", function(){
		if(mm.getPage() == 2){
			//When progressing past the player select screen the tempName variable is no longer required.
			delete tempName;
			
			//Add player objects once we progress past the player select screen.
			for(i=0; i < mm.getPlayers(); i++){
				playerData.push(new Player($("#p"+(i+1)+"Input").val(), 10, i));
			}
			
			//update the player count using the playerData.
			mm.setPlayers(playerData.length);			
		}
		
		//clear the screen and go to next.
		screen.clear();
		mm.nextPage();
		findScreen();
	});
	
	//Go backward a screen.
	$(document).on("click", "#arrowBack", function(){
		//store names temporarily.
		if(mm.getPage() == 2){	
			for(i=0; i < mm.getPlayers(); i++){
				tempName[i] = $("#p"+(i+1)+"Input").val();
			}
		}
		
		//clear the screen and go to previous.
		screen.clear();
		mm.previousPage();
		findScreen();
	});
	
	//decreases the number of players.
	$(document).on("click", "#lt", function(){
		if(mm.getPlayers() == mm.getMIN_PLAYERS()){
			screen.popUp("Dit spel kunt u alleen spelen met minimaal 2 mensen.");
		}else{
			mm.setPlayers((mm.getPlayers()-1));
			screen.updatePlayerOverview(mm.getPlayers());
		}
	});
	
	//increases the number of players.
	$(document).on("click", "#gt", function(){
		if(mm.getPlayers() == mm.getMAX_PLAYERS()){
			screen.popUp("Dit spel kunt u alleen spelen met maximaal 4 mensen.");
		}else{
			mm.setPlayers((mm.getPlayers()+1));
			screen.updatePlayerOverview(mm.getPlayers());
		}
	});
	
	//handles the click event on a playingfield square.
	$(document).on("click", ".selectableSquare", function(){
		
		//check if a player has more than 0 points, if not theyu cannot change squares.
		if(playerData[mm.getTurn()].getPoints() > 0){
			
			//set the selected square to the player's colour and subtract a point from the player.
			board.setSquare($(this).attr("id").split("-"), playerData[mm.getTurn()].getColour());
			playerData[mm.getTurn()].updatePoints(-1);
			
			//updates the visual screen, 'collision' and makes the clicked square no longer clickable.
			screen.updateGameScreen(board.readPlayingField(playerData, mm.getTurn()));
			screen.removeClickable(this);
			
			//check if there are more than 1 player on the field, if not find the final screen.
			findScreen(board.checkForPlayers(playerData));
			
			//update the displayed text next to the field.
			screen.updatePTXT(mm.getPage(), playerData, mm.getTurn());
		}else{
			screen.popUp("U heeft geen punten meer.");
		}
	});
	
	//Go to next turn
	$(document).on("click", "#nextTurn", function(){
		
		//get the currunt page based on player turns.
		tempPage = 0;
		tempPage = mm.nextTurn(playerData);
		
		//if the tempPage is not undfined or zero, clear the screen and find the next page.
		if(typeof tempPage != "undefined" && tempPage != 0){
			screen.clear();
			findScreen();
		}else{
			
			//if page is defined as 3 update the playing field and text.
			if(mm.getPage() == 3){
				screen.updateGameScreen(board.readPlayingField(playerData, mm.getTurn()));
				screen.updatePTXT(mm.getPage(), playerData, mm.getTurn());
			}else{
				//if defined as anything else update the text.
				screen.updatePTXT(mm.getPage(), playerData, mm.getTurn(), trivia);
			}
		}
		
		//set to false at the end of every turn so the next player can answer the question.
		answered = false;
	});
	
	//registers the clicked answer
	$(document).on("click", "#A", function(){
		if(answered == false){
			handleInput(this, "A");
		}
		
		//set to true to prevent players from clicking on the correct answer multiple times.
		answered = true;
	});
	
	$(document).on("click", "#B", function(){
		if(answered == false){
			handleInput(this, "B");
		}
		answered = true;
	});
	
	$(document).on("click", "#C", function(){
		if(answered == false){
			handleInput(this, "C");
		}
		answered = true;
	});
	
	//closes the message screen.
	$(document).on("click", "#X", function(){
		screen.closeMessage();
	});
	
});