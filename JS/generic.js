$(document).ready(function(){
	
	//declare necessary variables
	var page = 0;
	var players = 2;
	var playerData = [p1 = {name: "Speler 1", points: 10, isAlive: true, colour: "#F00"}, p2 = {name: "Speler 2", points: 10, isAlive: true, colour: "#00F"}, p3 = {name: "Speler 3", points: 10, isAlive: true, colour: "#0F0"}, p4 = {name: "Speler 4", points: 10, isAlive: true, colour: "#EE0"}];
	var field = new Array(15);
	var turn = 0;
	var gamestate = 0;
	var timer = [0, 0];
	var questionKey = 0;
	var answered = false;
	
	
	//initialising the field
	for(i=0; i<15; i++){
		field[i] = new Array(15);
		
		for(f=0; f<15; f++){
			field[i][f] = "#FFF";
		}
	}
	
	
	//page initialisation
	displayIntro();
	//displayPlayerSelect();
	//displayGameScreen();
	
	
	

	
	//------------------------------------------------------------------------- interactive GUI functions/action listeners -------------------------------
	
	//Continue to next screen
	$(document).on("click", "#ContinueArrow", function(){
		clear();
		page++;
		displayNextPage(page);
	});
	
	//Go back to previous screen
	$(document).on("click", "#arrowBack", function(){
		playerData[0].name = $("#p1Input").val();
		playerData[1].name = $("#p2Input").val();
		playerData[2].name = $("#p3Input").val();
		playerData[3].name = $("#p4Input").val();
		clear();
		displayNextPage(0);
	});
	
	//Go to the next screen, saves player data
	$(document).on("click", "#arrowForward", function(){
		playerData[0].name = $("#p1Input").val();
		playerData[1].name = $("#p2Input").val();
		playerData[2].name = $("#p3Input").val();
		playerData[3].name = $("#p4Input").val();
		clear();
		displayNextPage(2);
	});
	
	//increases the number of players
	$(document).on("click", "#lt", function(){
		if(players == 2){
			alert("Dit spel kunt u alleen spelen met minimaal 2 mensen.");
		}else{
			players--;
			$("#nr").html(players);
			updatePlayerOverview();
		}
	});
	
	//decreases the number of players
	$(document).on("click", "#gt", function(){
		if(players == 4){
			alert("Dit spel kunt u alleen spelen met maximaal 4 mensen.");
		}else{
			players++;
			$("#nr").html(players);
			updatePlayerOverview();
		}
	});
	
	//click event that turns a square to a player's colour
	$(document).on("click", ".selectableSquare", function(){
		if(playerData[turn].points > 0){
			
			var temp;
			
			$(this).css("backgroundColor", playerData[turn].colour);
			$(this).removeClass("selectableSquare");
			temp = $(this).attr("id").split("-");
			field[temp[0]][temp[1]] = playerData[turn].colour;
			playerData[turn].points --;
			updatePlayingField();
			checkPlayers();
			updatePTXT();
		}else{
			alert("U heeft geen punten meer.");
		}
	});
	
	//calls next turn when the arrow is clicked
	$(document).on("click", "#nextTurnArrow", function(){
		nextTurn();
	});
	
	
	//registers the clicked answer
	$(document).on("click", "#A", function(){
		if(answered == false){
			checkAnswer("A");
		}
		answered = true;
	});
	
	$(document).on("click", "#B", function(){
		if(answered == false){
			checkAnswer("B");
		}
		answered = true;
	});
	
	$(document).on("click", "#C", function(){
		if(answered == false){
			checkAnswer("C");
		}
		answered = true;
	});
	
	
	//----------------------------------------------------------------------------------- logic functions ------------------------------------------------- 
	
	//clears the wrapper
	function clear(){
		$("#wrapper").html("");
	};
	
	//prints and animates objects onto screen using: element (e), html content (c), distance from left (d) and animation time (t)
	function print(e, c, d, t){
		$("#wrapper").append(c);
		$(e).animate({left: d}, t);
	}
	
	function checkAnswer(lt){
		timer[1] = performance.now();
		
		//var sc = getScore(timer[0], timer[1]);
		
		if(questions[questionKey].an == lt){
			
			playerData[turn].points += getScore(timer[0], timer[1]);

			$("#" + lt.toUpperCase()).css("background-color", "#DFD");
		}else{
			
			$("#" + lt.toUpperCase()).css("background-color", "#FDD");
		}
	}
	
	//Score calculation formula:
	//Math.round(20*(Math.pow((( ΔT )/1000), -1)))
	function getScore(t0, t1){
		return Math.round(20*(Math.pow(((t1 - t0)/1000), -1)));
	}
	//timer[1] - timer[0])/1000                                        get the time difference (ΔT) and turn it from miliseconds into seconds (Δs)
	//Math.pow(((timer[1] - timer[0])/1000), -1)                       get the value of Δs^-1
	//20*(Math.pow(((timer[1] - timer[0])/1000), -1))                  multiply this value by 20
	//Math.round(20*(Math.pow(((timer[1] - timer[0])/1000), -1)))      round the the resulting value to nearest full number
	
	function setNewKey(){
		
		var temp = Math.round(Math.random()*(questions.length-1));
		
		while(temp == questionKey){
			temp = Math.round(Math.random()*(questions.length-1));
		}
		questionKey = temp;
	}
	
	//update player table overview, hide or display players
	function updatePlayerOverview(){
		if(players == 2){
			$("#p3, #p4").css("display", "none");
		}else if(players == 3){
			$("#p3").css("display", "table-row");
			$("#p4").css("display", "none");
		}else{
			$("#p3, #p4").css("display", "table-row");
		}
	}
	
	//updates 'collision' based on i, f, player colour (pc).
	function updateCollision(i, f, pc){
		
		if(field[i][f] == playerData[turn].colour){
			
			//check if the vertical axis exists
			//notice there is only a check performed on the horizontal axis as checking for "field[i-1][f]" throws an undefined error since the 'i' axis doesn't exist.
			if(typeof field[i-1] != "undefined"){
				if(field[i-1][f] != pc){
					$("#" + (i-1) + "-" + f).addClass("selectableSquare");
				}
			}
			
			if(typeof field[i+1] != "undefined"){
				if(field[i+1][f] != pc){
					$("#" + (i+1) + "-" + f).addClass("selectableSquare");
				}
			}
			
			//check horizontally if the field exists
			if(typeof field[i][f-1] != "undefined"){
				if(field[i][f-1] != pc){
					$("#" + i + "-" + (f-1)).addClass("selectableSquare");
				}
			}
			
			if(typeof field[i][f+1] != "undefined"){
				if(field[i][f+1] != pc){
					$("#" + i + "-" + (f+1)).addClass("selectableSquare");
				}
			}
		}				
	}
	
	//updates the squares in the fields and adds colour and 'collision'
	function updatePlayingField(){
		
		$(".selectableSquare").removeClass("selectableSquare")
		
		//loop through all fields of field matrix
		for(i=0; i<15; i++){
			for(f=0; f<15; f++){
				
				//read from matrix and apply read colour to display
				switch(field[i][f]){
					case playerData[0].colour:
						$("#" + i + "-" + f).css("background-color", playerData[0].colour);
						
						updateCollision(i, f, playerData[0].colour);
						
						break;
					case playerData[1].colour:
						$("#" + i + "-" + f).css("background-color", playerData[1].colour);
						
						updateCollision(i, f, playerData[1].colour);
						
						break;
					case playerData[2].colour:
						$("#" + i + "-" + f).css("background-color", playerData[2].colour);
						
						updateCollision(i, f, playerData[2].colour);
						
						break;
					case playerData[3].colour:
						$("#" + i + "-" + f).css("background-color", playerData[3].colour);
						
						updateCollision(i, f, playerData[3].colour);
						
						break;
					default:
						$("#" + i + "-" + f).css("background-color", "#FFF");
				}
			}
		}
	}
	
	//Selects the next page to select so that users can navigate back and forth.
	function displayNextPage(p){
		
		clear();
		
		if(p == 2 && page == 1){
			prepareField();
		}
		
		page = p;
		
		switch(p){
			case 0:
				displayIntro();
				break;
			case 1:
				displayPlayerSelect();
				break;
			case 2:
				displayGameScreen();
				break;
			case 3:
				displayTrivia();
				break;
			case 4:
				displayEndScreen();
				break;
		}
	}
	
	//puts all the players on the field based on the number of players
	function prepareField(){
		
		if(players == 2){
			playerData[2].isAlive = false;
			playerData[3].isAlive = false;
			
			field[7][1] = playerData[0].colour;
			field[7][13] = playerData[1].colour;
		}else if(players == 3){
			playerData[3].isAlive = false;
			
			field[1][1] = playerData[0].colour;
			field[1][13] = playerData[1].colour;
			field[13][7] = playerData[2].colour;
		}else{
			field[7][1] = playerData[0].colour;
			field[7][13] = playerData[1].colour;
			field[13][7] = playerData[2].colour;
			field[1][7] = playerData[3].colour;
		}
	}
	
	//check on players and if they have no colour on the field they will be considered dead.
	function checkPlayers(){
		
		var temp = [0, 0, 0, 0];
		
		for(i=0; i<15; i++){
			for(f=0; f<15; f++){
				switch(field[i][f]){
					case playerData[0].colour:
						temp[0] = 1;
						break;
					case playerData[1].colour:
						temp[1] = 1;
						break;
					case playerData[2].colour:
						temp[2] = 1;
						break;
					case playerData[3].colour:
						temp[3] = 1;
						break;
				}
			}
		}
		
		for(i=0; i<4; i++){
			if(temp[i] == 0){
				playerData[i].isAlive = false;
			}
		}
		
		//If there are fewer than 2 players the game ends
		if((temp[0] + temp[1] + temp[2] + temp[3]) < 2){
			displayNextPage(4);
		}

	}
	
	function getLive(temp){
		for(i=0; i<4; i++){
			if(playerData[i].isAlive){
				return playerData[i].name;
				break;
			}
		}
	}
	
	//hands the turn over to the next player or game round.
	function nextTurn(){
		
		//In case a compatible next turn cannot be found we still break the loop so that we do not encounter any infinite loops.
		var infiniBreak = 0;
		
		while(infiniBreak < 100){
			turn++;
			infiniBreak++;
			
			//If we reach the maximum amount of players set turn back to 0. -1 to account for the difference between the 0 index array and actualy number of players.
			//Every time we reach the max we complete a round in which everyone has had one turn and we switch gamestates.
			if(turn > (players-1)){
				turn = 0;
				toggleGameState();
			}
			
			
			if(playerData[turn].isAlive){
				break;
			}
		}
		
		updatePlayingField();
		updatePTXT();
		answered = false;
	}
	
	function toggleGameState(){
		
		if(page == 2){
			displayNextPage(3);
		}else if(page == 3){
			displayNextPage(2);
		}
	}
	
	
	
	
	
	
	//----------------------------------------------------------------------------- page display functions -------------------------------------------
	
	//introduction and start-up animations script
	function displayIntro(){
		print("#introTitle", "<div id='introTitle' class='hidden title'>Welkom</div>", '30px', 1000);
		print("#introText", "<p id='introText' class='hidden'>In dit spel speelt u tegen elkaar met 2 tot 4 spelers.<br/> Het spel bestaat uit twee delen, namelijk een gedeelte gebaseerd op Risk waar u punten besteed.<br/> En een trivia gedeelte waar u punten verdient.<br/></p>", '30px', 2000);
		print("#RulesTitle", "<div id='RulesTitle' class='hidden title'>Regels</div>", '30px', 2500);
		print("#RulesText", "<p id='RulesText' class='hidden'> De regels zijn simpel, u begint op een van de vakken op het bord.<br/> Het doel is om de kleuren van alle spelers van het bord te verwijderen door middel van het versprijden van uw eigen kleur.<br/> Dit doet u door middel van het klikken op het vak wat u wilt overnemen binnen uw ronde. <br/> Echter kunt u alleen vakken overnemen naast een vak van uw eigen kleur. <br/> Ook kosten alle vakken een punt, punten kunt u verdienen in de tussenrondes.<br/> In deze tussenrondes krijgt iedere speler een trivia vraag en als de speler de vraag goed en snel beantwoord krijgt hij of zij een punt.<br/> Hoe sneller het antwoord hoe meer punten.<br/><br/>Belangrijk: Ververs de pagina niet dan herstart het spel.<br/><br/><br/></p>", '30px', 3500);
		print("#ContinueText, #ContinueArrow", "<p id='ContinueText' class='hidden'>Klik om verder te gaan op de pijl<p><img id='ContinueArrow' class='hidden selectable' src='./RES/IMG/Arrow.png'/>", '30px', 5000);
	}
	
	//player selectionscreen display
	function displayPlayerSelect(){
		print("#playerTitle", "<div id='playerTitle' class='hidden title'>Selecteer spelers</div>", '30px', 1000);
		print("#playerText", "<p id='playerText' class='hidden'>Geef asltublieft hieronder het aantal spelers aan door op &lt; te klikken voor minder, of &gt; voor meer.</p>", '30px', 1500);
		print("#selectionScreen", "<div id='selectionScreen' class='hidden tableScreen'> <table> <tr> <td id='lt' class='selectable'> &lt; </td> <td id='nr'> 2 </td> <td id='gt' class='selectable'> &gt; </td> </tr> </table> </div>", '30px', 2000);
		print("#tableText", "<br/><br/><p id='tableText' class='hidden'> Geef hieronder asltublieft voor elke speler een naam op.</p>", '30px', 2500);
		print("#tablePlayers", "<div id='tablePlayers' class='hidden tableScreen'>   <table>    <tr id='p1'> <td>Speler 1:</td> <td><input id='p1Input' type='text' name='np1' value='Speler 1'/></td> </tr>    <tr id='p2'> <td>Speler 2:</td> <td><input id='p2Input' type='text' name='np2' value='Speler 2'/></td> </tr>    <tr id='p3'> <td>Speler 3:</td> <td><input id='p3Input' type='text' name='np3' value='Speler 3'/></td> </tr>    <tr id='p4'> <td>Speler 4:</td> <td><input id='p4Input' type='text' name='np4' value='Speler 4'/></td> </tr>    </table>   </div>", '30px', 3000);
		print("#finalText", "<p id='finalText' class='hidden'>Als u tevreden bent kunt u hieronder klikken op de pijl naar rechts om verder te gaan,<br/> of de pijl naar links om de regels nogmaals te bekijken.</p>", '30px', 4000);		
		print("#arrows", "<div id='arrows' class='hidden'><table><tr><td> <img id='arrowBack' class='selectable' src='./RES/IMG/Arrow.png' title='terug'/> </td><td> <img id='arrowForward' class='selectable' src='./RES/IMG/Arrow.png' title='verder'/> </td></tr></table></div>", '30px', 4500);
		
		$("#p1").css("color", playerData[0].colour);
		$("#p2").css("color", playerData[1].colour);
		$("#p3").css("color", playerData[2].colour);
		$("#p4").css("color", playerData[3].colour);
		
		$("#nr").html(players);
		$("#p1Input").val(playerData[0].name);
		$("#p2Input").val(playerData[1].name);
		$("#p3Input").val(playerData[2].name);
		$("#p4Input").val(playerData[3].name);
		updatePlayerOverview();
	}
	
	//main game screen
	function displayGameScreen(){
		
		var fieldHTML = "";
		var playerStatusHTML = "";
		var fieldStatus = 0;
		
		//prepareField();
		
		for(i=0; i<15; i++){
			fieldHTML = fieldHTML + "<tr>";
			for(f=0; f<15; f++){
				fieldHTML = fieldHTML + "<td><div class='square' id='" + i + "-" + f + "'></div></td>";
			}
			fieldHTML = fieldHTML + "</tr>";
		}
		
		for(i=0; i<players; i++){
			playerStatusHTML = playerStatusHTML + playerData[i].name + " heeft " + playerData[i].points + " punten.<br/>";
		}
		
		print("#playerTitle", "<div id='playerTitle' class='title hidden board'>Spelers</div>", '40%', 1000);
		print("#playerStatus", "<p id='playerStatus' class='hidden board'>" + playerStatusHTML + "</p>", '40%', 1000);
		print("#container", "<div id='container' class='hidden board'><table id='playingfield'>" + fieldHTML + "</table></div>", '3%', 1000);
		print("#turnTitle", "<div id='turnTitle' class='title hidden board'>Beurt</div>", '40%', 1000);
		print("#turnText", "<p id='turnText' class='hidden board'>De beurt is nu aan <span id='currentPlayer'> " + playerData[turn].name + "</span>.<br/> Selecteer door op een vak te klikken welk vak u naast uw vak(ken) wil overnemen.<br />Als u klaar bent of geen punten meer heeft klik dan op de pijl hieronder om de ronde door te geven.</p>", '40%', 1000);
		print("#ContinueText, #nextTurnArrow", "<p id='ContinueText' class='hidden board'>Volgende ronde<p><img id='nextTurnArrow' class='hidden selectable' src='./RES/IMG/Arrow.png'/>", '40%', 1000);
		$("#currentPlayer").css("color", playerData[turn].colour);
		updatePlayingField();
	}
	
	function updatePTXT(){
		
		if(page == 2){
		
			var playerStatusHTML = "";
			
			for(i=0; i<players; i++){
				
				if(playerData[i].isAlive == true){
					playerStatusHTML = playerStatusHTML + playerData[i].name + " heeft " + playerData[i].points + " punten.<br />";
				}else{
					playerStatusHTML = playerStatusHTML + playerData[i].name + " is VERSLAGEN. <br />";
				}
				
			}
			
			$("#playerStatus").html(playerStatusHTML);
			$("#currentPlayer").html(playerData[turn].name);
			$("#currentPlayer").css("color", playerData[turn].colour);
		}
		
		if(page == 3){
			
			setNewKey();
			
			console.log(questionKey);
			
			$("#playerName").html(playerData[turn].name);
			$("#question").html(questions[questionKey].q);
			$("#answers").html("<div id='A' class='answer'>A. "+ questions[questionKey].a +"</div> <div id='B' class='answer'>B. "+ questions[questionKey].b +"</div> <div id='C' class='answer'>C. "+ questions[questionKey].c +"</div>");
			
			timer[0] = performance.now();
		}
	}
	
	function displayTrivia(){
		
		setNewKey();
		
		print("#playerName", "<div class='hidden title' id='playerName'>"+playerData[turn].name+"</div>", "30px", 100);
		print("#question", "<p id='question' class='hidden'>"+ questions[questionKey].q +"</p>", "30px", 100);
		print("#answers", "<div id='answers' class='hidden'> <div id='A' class='answer'>A. "+ questions[questionKey].a +"</div> <div id='B' class='answer'>B. "+ questions[questionKey].b +"</div> <div id='C' class='answer'>C. "+ questions[questionKey].c +"</div> </div><br/><br/>", "30px", 100);
		print("#nextTurnArrow", "<img id='nextTurnArrow' class='hidden selectable' src='./RES/IMG/Arrow.png'/>", '30px', 100);
		
		timer[0] = performance.now();
	}
	
	function displayEndScreen(){
		clear();
		print("#FinalTitle", "<div id='FinalTitle' class='title hidden'>En de winnaar is:</div>", '33px', 1000);
		print("#FinalText", "<p id='FinalText' class='hidden'>"+getLive()+"</p>", '33px', 2000);
		print("#closing", "<p id='closing' class='hidden'>Wilt u overnieuw spelen dan kunt u de pagina verversen, zo niet dan kunt u dit venster sluiten</p>", '33px', 3000);
	}
	
});

//"<table id='arrows'><tr><td> <img id='arrowBack' src='./RES/IMG/Arrow.png' title='terug'/> </td><td> <img id='arrowForward' src='./RES/IMG/Arrow.png' title='verder'/> </td></tr></table>"
//"<div id='tablePlayers' class='hidden tableScreen'>   <table>    <tr id='p1'> <td>Speler 1</td> <td><input type='text' name='np1' value='Speler 1'/></td> </tr>    <tr id='p2'> <td>Speler 2</td> <td><input type='text' name='np2' value='Speler 2'/></td> </tr>    <tr id='p3'> <td>Speler 3</td> <td><input type='text' name='np3' value='Speler 3'/></td> </tr>    <tr id='p4'> <td>Speler 4</td> <td><input type='text' name='np4' value='Speler 4'/></td> </tr>    </table>   </div>"
