class GUI{
	
	//clears the wrapper(sxreen) from any contents.
	clear(){
		$("#wrapper").html("");
	}
	
	//prints and animates objects onto screen using: element (e), html content (c), distance from left (d) and animation time (t).
	print(e, c, d, t){
		$("#wrapper").append(c);
		$(e).animate({left: d}, t);
	}
	
	//show a message on the screen.
	popUp(message){
		$("#wrapper").append("<div id='shade'><div id='message'><div id='X'>X</div>"+message+"</div></div>");
	}
	
	//close the message.
	closeMessage(){
		$("#shade").remove();
	}
	
	//removes the class clickable from a square that has that class.
	removeClickable(e){
		
		//Removes all selectableSquare classes from all squares
		if(typeof e == "undefined"){
			$(".selectableSquare").removeClass("selectableSquare");
		//Removes selectableSquare only from the given element (e)
		}else{
			$(e).removeClass("selectableSquare");
		}
		
	}
	
	//updates the playerSelectScreen.
	updatePlayerOverview(players){
		
		//in case players is undefined we set it to 2.
		if(typeof players == "undefined") players = 2;
		
		//set the number on the screen.
		$("#nr").html(players);
		
		//add or subtract input rows from the display.
		if(players == 2){
			$("#p3, #p4").css("display", "none");
		}else if(players == 3){
			$("#p3").css("display", "table-row");
			$("#p4").css("display", "none");
		}else{
			$("#p3, #p4").css("display", "table-row");
		}
	}
	
	//introduction and start-up animations script
	displayIntro(){
		this.print("#introTitle", "<div id='introTitle' class='hidden title'>Welkom</div>", '30px', 1000);
		this.print("#introText", "<p id='introText' class='hidden'>In dit spel speelt u tegen elkaar met 2 tot 4 spelers.<br/> Het spel bestaat uit twee delen, namelijk een gedeelte gebaseerd op Risk waar u punten besteed.<br/> En een trivia gedeelte waar u punten verdient.<br/></p>", '30px', 2000);
		this.print("#RulesTitle", "<div id='RulesTitle' class='hidden title'>Regels</div>", '30px', 2500);
		this.print("#RulesText", "<p id='RulesText' class='hidden'> De regels zijn simpel, u begint op een van de vakken op het bord.<br/> Het doel is om de kleuren van alle spelers van het bord te verwijderen door middel van het versprijden van uw eigen kleur.<br/> Dit doet u door middel van het klikken op het vak wat u wilt overnemen binnen uw ronde. <br/> Echter kunt u alleen vakken overnemen naast een vak van uw eigen kleur. <br/> Ook kosten alle vakken een punt, punten kunt u verdienen in de tussenrondes.<br/> In deze tussenrondes krijgt iedere speler een trivia vraag en als de speler de vraag goed en snel beantwoord krijgt hij of zij een punt.<br/> Hoe sneller het antwoord hoe meer punten.<br/><br/>Belangrijk: Ververs de pagina niet dan herstart het spel.<br/><br/><br/></p>", '30px', 3500);
		this.print("#ContinueText, #ContinueArrow", "<p id='ContinueText' class='hidden'>Klik om verder te gaan op de pijl<p><img id='ContinueArrow' class='hidden selectable' src='./RES/IMG/Arrow.png'/>", '30px', 5000);
	}
	
	//displays the player select screen
	displayPlayerSelect(players, names){
		this.print("#playerTitle", "<div id='playerTitle' class='hidden title'>Selecteer spelers</div>", '30px', 1000);
		this.print("#playerText", "<p id='playerText' class='hidden'>Geef asltublieft hieronder het aantal spelers aan door op &lt; te klikken voor minder, of &gt; voor meer.</p>", '30px', 1500);
		this.print("#selectionScreen", "<div id='selectionScreen' class='hidden tableScreen'> <table> <tr> <td id='lt' class='selectable'> &lt; </td> <td id='nr'> 2 </td> <td id='gt' class='selectable'> &gt; </td> </tr> </table> </div>", '30px', 2000);
		this.print("#tableText", "<br/><br/><p id='tableText' class='hidden'> Geef hieronder asltublieft voor elke speler een naam op.</p>", '30px', 2500);
		this.print("#tablePlayers", "<div id='tablePlayers' class='hidden tableScreen'>   <table>    <tr id='p1'> <td>Speler 1:</td> <td><input id='p1Input' type='text' name='np1' value='Speler 1'/></td> </tr>    <tr id='p2'> <td>Speler 2:</td> <td><input id='p2Input' type='text' name='np2' value='Speler 2'/></td> </tr>    <tr id='p3'> <td>Speler 3:</td> <td><input id='p3Input' type='text' name='np3' value='Speler 3'/></td> </tr>    <tr id='p4'> <td>Speler 4:</td> <td><input id='p4Input' type='text' name='np4' value='Speler 4'/></td> </tr>    </table>   </div>", '30px', 3000);
		this.print("#finalText", "<p id='finalText' class='hidden'>Als u tevreden bent kunt u hieronder klikken op de pijl naar rechts om verder te gaan,<br/> of de pijl naar links om de regels nogmaals te bekijken.</p>", '30px', 4000);		
		this.print("#arrows", "<div id='arrows' class='hidden'><table><tr><td> <img id='arrowBack' class='selectable' src='./RES/IMG/Arrow.png' title='terug'/> </td><td> <img id='ContinueArrow' class='selectable' src='./RES/IMG/Arrow.png' title='verder'/> </td></tr></table></div>", '30px', 4500);
		
		//set the name input fields ONLY if we have names to set.
		if(typeof names != "undefined" && names[0] != "undefined" && names[0] != null){
			
			$("#p1Input").val(names[0]);
			$("#p2Input").val(names[1]);
			$("#p3Input").val(names[2]);
			$("#p4Input").val(names[3]);
		}
		
		this.updatePlayerOverview(players);
	}
	
	//main game screen
	displayGameScreen(pd, size, turn){
		
		this.fieldHTML = "";
		this.playerStatusHTML = "";
		
		//prepare the html that will display the contents of the matrix on the field.
		for(this.i=0; this.i<size; this.i++){
			this.fieldHTML = this.fieldHTML + "<tr>";
			for(this.f=0; this.f<size; this.f++){
				this.fieldHTML = this.fieldHTML + "<td><div class='square' id='" + this.i + "-" + this.f + "'></div></td>";
			}
			this.fieldHTML = this.fieldHTML + "</tr>";
		}
		
		//prepare the player status text
		for(this.i=0; this.i<pd.length; this.i++){
			this.playerStatusHTML = this.playerStatusHTML + pd[this.i].getName() + " heeft " + pd[this.i].getPoints() + " punten.<br/>";
		}
		
		this.print("#playerTitle", "<div id='playerTitle' class='title hidden board'>Spelers</div>", '40%', 1000);
		this.print("#playerStatus", "<p id='playerStatus' class='hidden board'>" + this.playerStatusHTML + "</p>", '40%', 1000);
		this.print("#container", "<div id='container' class='hidden board'><table id='playingfield'>" + this.fieldHTML + "</table></div>", '3%', 1000);
		this.print("#turnTitle", "<div id='turnTitle' class='title hidden board'>Beurt</div>", '40%', 1000);
		this.print("#turnText", "<p id='turnText' class='hidden board'>De beurt is nu aan <span id='currentPlayer'> " + pd[turn].getName() + "</span>.<br/> Selecteer door op een vak te klikken welk vak u naast uw vak(ken) wil overnemen.<br />Als u klaar bent of geen punten meer heeft klik dan op de pijl hieronder om de ronde door te geven.</p>", '40%', 1000);
		this.print("#ContinueText, #nextTurn", "<p id='ContinueText' class='hidden board'>Volgende ronde<p><img id='nextTurn' class='hidden selectable' src='./RES/IMG/Arrow.png'/>", '40%', 1000);
		$("#currentPlayer").css("color", pd[turn].getColour());
	}
	
	updateGameScreen(fieldUpdate){
		
		this.removeClickable();
		
		for(this.i=0; this.i<fieldUpdate[0].length; this.i++){
			$("#"+fieldUpdate[0][this.i][0]+"-"+fieldUpdate[0][this.i][1]).css("background-color", fieldUpdate[0][this.i][2]);
		}
		
		for(this.i=0; this.i<fieldUpdate[1].length; this.i++){
			$(fieldUpdate[1][this.i]).addClass("selectableSquare");
		}
	}
	
	updatePTXT(page, pd, turn, qu){
		
		//if the current screen is the main game screen update the player text for next to the field.
		if(page == 3){
		
			this.playerStatusHTML = "";
			
			for(this.i=0; this.i<pd.length; this.i++){
				
				if(pd[this.i].checkLive()){
					this.playerStatusHTML = this.playerStatusHTML + pd[this.i].getName() + " heeft " + pd[this.i].getPoints() + " punten.<br />";
				}else{
					this.playerStatusHTML = this.playerStatusHTML + pd[this.i].getName() + " is VERSLAGEN. <br />";
				}
				
			}
			
			$("#playerStatus").html(this.playerStatusHTML);
			$("#currentPlayer").html(pd[turn].getName());
			$("#currentPlayer").css("color", pd[turn].getColour());
		}
		
		//if the current screen is the trivia screen, get the next question and display that.
		if(page == 4){
			
			this.temp = qu.getRandQuestion();
			
			$("#playerName").html(pd[turn].getName());
			$("#question").html(this.temp.q);
			$("#answers").html("<div id='A' class='answer'>A. "+ this.temp.a +"</div> <div id='B' class='answer'>B. "+ this.temp.b +"</div> <div id='C' class='answer'>C. "+ this.temp.c +"</div>");
			
			qu.setTimer();
		}
	}
	
	displayTrivia(pd, qu, turn){
		
		this.temp = qu.getRandQuestion();
		
		this.print("#playerName", "<div class='hidden title' id='playerName'>"+pd[turn].name+"</div>", "30px", 100);
		this.print("#question", "<p id='question' class='hidden'>"+ this.temp.q +"</p>", "30px", 100);
		this.print("#answers", "<div id='answers' class='hidden'> <div id='A' class='answer'>A. "+ this.temp.a +"</div> <div id='B' class='answer'>B. "+ this.temp.b +"</div> <div id='C' class='answer'>C. "+ this.temp.c +"</div> </div><br/><br/>", "30px", 100);
		this.print("#nextTurn", "<img id='nextTurn' class='hidden selectable' src='./RES/IMG/Arrow.png'/>", '30px', 100);
		
		qu.setTimer();
	}
	
	//set the colour of the selected answer button to red or green depending on if the answer was correct or not..
	updateTriviaButton(element, correct){
		if(correct){
			$(element).css("background-color", "#DFD");
		}else{
			$(element).css("background-color", "#FDD");
		}
	}
	
	displayEndScreen(player){
		this.clear();
		this.print("#FinalTitle", "<div id='FinalTitle' class='title hidden'>En de winnaar is:</div>", '33px', 1000);
		this.print("#FinalText", "<p id='FinalText' class='hidden'>"+player.getName()+"</p>", '33px', 2000);
		this.print("#closing", "<p id='closing' class='hidden'>Wilt u overnieuw spelen dan kunt u de pagina verversen, zo niet dan kunt u dit venster sluiten</p>", '33px', 3000);
	}

}
