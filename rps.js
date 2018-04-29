/*
    rps.js by Bill Weinman  <http://bw.org/contact/>
    created 2011-07-12
    updated 2012-07-28
    Copyright (c) 2011-2012 The BearHeart Group, LLC
    This file may be used for personal educational purposes as needed. 
    Use for other purposes is granted provided that this notice is
    retained and any changes made are clearly indicated as such. 
*/

var dndSupported; //Grava se o browser permite fazer "Drag and drop"
var dndEls = new Array(); //Array que contém os elementos que podem ser Dragged and Dropped (neste caso são o rock,paper e scissors)
var draggingElement; // Elemento que está a ser arrastado
var winners = { // variável que determina quem ganha a quem, neste caso Rock ganha a Paper, Paper a Scissors e Scissors a Rock
    Rock: 'Paper',
    Paper: 'Scissors',
    Scissors: 'Rock'
};

var hoverBorderStyle = '2px dashed #999'; //Estilo do elemento quando está a ser hovered ou está a "pairar"
var normalBorderStyle = '2px solid white'; //Estilo normal do elemento

//Função que varifica se o browser permite fazer "Drag and drop"
function detectDragAndDrop() {
	//Funcionamento apenas para o Internet Explorer
    if (navigator.appName == 'Microsoft Internet Explorer') { 
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null) {
            var rv = parseFloat( RegExp.$1 );
            if(rv >= 6.0) return true;
            }
        return false;
    }
    if ('draggable' in document.createElement('span')) return true; 	//Caso dê para arrastar o return fica true, logo o browser permite "Drag and Drop"
    return false; //Caso contrário return fica false, logo o browser não permite "Drag and Drop"
}

// DnD support

//Função que determina as caracteristicas que os elementos ganham quando começam a ser arrastados
function handleDragStart(e) {
    var rpsType = getRPSType(this); //Tipo do elemento como Rock, Paper ou Scissors
    draggingElement = this;
    draggingElement.className = 'moving'; //Classe do elemento quando começa a ser arrastado
    statusMessage('Drag ' + rpsType); //Cria uma status message quando é arrastado
    this.style.opacity = '0.4'; //Opacidade reduzida assim que é arrastado
    this.style.border = hoverBorderStyle; //Altera o estilo do border do elemento
    e.dataTransfer.setDragImage(getRPSImg(this), 120, 120); // set the drag image

}

//Controla os elementos quando deixam de ser arrastados
function handleDragEnd(e) {
    this.style.opacity = '1.0'; //Volta a colocar a opacidade em 1
    // reset the element style
    draggingElement.className = undefined; 
    draggingElement = undefined; 

    // reset all of the elements
    for(var i = 0; i < dndEls.length; i++) {
        dndEls[i].style.border = normalBorderStyle; //Border volta a ficar no seu estilo normal
    }
}

//Função que controla o elemento enquanto este sobrevoa outro elemento
function handleDragOver(e) {
    if(e.preventDefault) e.preventDefault();
    this.style.border = hoverBorderStyle; //Altera o estilo do border do elemento

    return false;   // some browsers may need this to prevent default action
}

//Função que controla o elemento enquanto este sobrevoa outro elemento
function handleDragEnter(e) {
    if(this !== draggingElement) statusMessage('Hover ' + getRPSType(draggingElement)    + ' over ' + getRPSType(this)); //Cria uma status message quando sobrevoa outro elemento
}

//Função que controla o elemento quando este é pousado ou deixado em cima doutro
function handleDragLeave(e) {
    this.style.border = normalBorderStyle; //Volta a colocar a border no seu estilo normal
}

//Função que controla o elemento quanto este é pousado ou deixado em cima doutro elemento 
function handleDrop(e) {
    if(e.stopPropegation) e.stopPropagation(); // Stops some browsers from redirecting.
    if(e.preventDefault) e.preventDefault();
    if(this.id === draggingElement.id) return; //Se o elemento arrastado for igual ao pousado este mesmo da return
    else isWinner(this, draggingElement); //Caso contrário o jogo verifica se ganhou o jogo
}

// utility functions
//Função lógica do jogo ou seja verifica se a jogada é vencedora ou não
function isWinner(under, over) {
    var underType = getRPSType(under); //Elemento que está em baixo
    var overType = getRPSType(over); //Elemento que está em cima
    if(overType == winners[underType]) { //Verifica se o elemento que se encontra em cima ganha contra o elemento que está em baixo
        statusMessage(overType + ' beats ' + underType); //Cria uma status message a indicar que ganhou
        swapRPS(under, over); //Troca as imagens do elemento de cima com o de baixo caso este ganhe
    } else { //Se não ganhar
        statusMessage(overType + ' does not beat ' + underType); //Cria uma status message a indicar que perdeu
    }
}

//Função que da return à legenda (ou footer) do objeto (ex: Paper)
function getRPSFooter(e) {
    var children = e.childNodes;
	
    for( var i = 0; i < children.length; i++ ) {
        if( children[i].nodeName.toLowerCase() == 'footer' ) return children[i];
    }
    return undefined;
}

//Função que da return a imagem do objeto
function getRPSImg(e) {
    var children = e.childNodes;
    for( var i = 0; i < children.length; i++ ) {
        if( children[i].nodeName.toLowerCase() == 'img' ) return children[i];
    }
    return undefined;
}

//Função que da return ao tipo do objeto
//O tipo é determinado pela legenda da imagem (ex: Paper)
function getRPSType(e) {
    var footer = getRPSFooter(e); //Verifica se possui uma legenda ou footer
    if(footer) return footer.innerHTML; //Se sim devolve o footer.innerHTML 
    else return undefined; //Caso contrário devolve undefined
}

//Função que troca as imagens dos elementos
function swapRPS(a, b) {
    var holding = Object(); //Variável do objecto que está a ser segurado

    holding.img = getRPSImg(a);
    holding.src = holding.img.src;
    holding.footer = getRPSFooter(a);
    holding.type = holding.footer.innerHTML;
    
    holding.img.src = getRPSImg(b).src;
    holding.footer.innerHTML = getRPSType(b);
	
    getRPSImg(b).src = holding.src;
    getRPSFooter(b).innerHTML = holding.type;
}

// Utility functions

var elStatus; //Variável utilizada para guardar o estado do elemento

//Função que dá return ao elemento a partir do ID
function element(id) { 
return document.getElementById(id); }


//Função que controla as status messages
function statusMessage(s) {
    if(!elStatus) elStatus = element('statusMessage');
    if(!elStatus) return;
    if(s) elStatus.innerHTML = s;
    else elStatus.innerHTML = '&nbsp;';
}

// App lifetime support

//Função inicial do jogo
function init() {
    if((dndSupported = detectDragAndDrop())) { //Se o browser permitir fazer "Drag and drop"
        statusMessage('Using HTML5 Drag and Drop'); //Cria  uma nova status sessage
        dndEls.push(element('rps1'), element('rps2'), element('rps3')); //Cria os elementos Rock, Paper e Scissors
        for(var i = 0; i < dndEls.length; i++) {
			
			//Econtrei as seguintes definições no website: https://developer.mozilla.org/en-US/docs/Web/API/DragEvent
			
            dndEls[i].addEventListener('dragstart', handleDragStart, false); //dragstart - This event is fired when the user starts dragging an element or text selection.
            dndEls[i].addEventListener('dragend', handleDragEnd, false); //dragend - This event is fired when a drag operation is being ended (by releasing a mouse button or hitting the escape key).
            dndEls[i].addEventListener('dragover', handleDragOver, false); //dragover - This event is fired continuously when an element or text selection is being dragged and the mouse pointer is over a valid drop target
            dndEls[i].addEventListener('dragenter', handleDragEnter, false); //dragenter - This event is fired when a dragged element or text selection enters a valid drop target.
            dndEls[i].addEventListener('dragleave', handleDragLeave, false); //dragleave - This event is fired when a dragged element or text selection leaves a valid drop target.
            dndEls[i].addEventListener('drop', handleDrop, false); //drop - This event is fired when an element or text selection is dropped on a valid drop target.
        }
	//Caso contrário
    } else {
        statusMessage('This browser does not support Drag and Drop'); //Cria uma status message
    }
}

//Assim que a página der load o jogo inicia
window.onload = init;