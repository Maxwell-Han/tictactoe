

const flash = document.querySelector('.flash')
const size = document.querySelector(".gridSize")
const startButton = document.querySelector(".startGame")
startButton.classList.toggle('none')
const reset = document.querySelector(".resetBoard")
const board = document.querySelector('.gameBoard')
let p1Score = document.querySelector("#p1Score")
let p2Score = document.querySelector("#p2Score")
let htmlStyles = window.getComputedStyle(document.querySelector("html"));
let boardArr = []


startButton.addEventListener('click', () => {
	if(events.hasNames() && size.value > 2 && size.value < 11 && !game.status){
		players.first = Player(p1Name.value, "X")
		players.second = Player(p2Name.value, "O")
		game.status = true
		setUp.setGridSize()
		setUp.styleColumns()
		setUp.setBoardArr()
  		addListeners()
		messages.sayGoP1()
		players.first.turn = true
		reset.classList.toggle("none")
		startButton.classList.toggle("none")
	//otherwise change flash message
	}else if(events.hasNames() && size.value === ''){
		messages.saySetSize()
	}else{
		messages.sayEnterNames()
	}
})

const setUp = ( () => {
	const setBoardArr = () =>{
	  let j = 0
	  let temp = []
		for(let i = 0; i < size.value * size.value; i++){
	      if(j < size.value){
	        temp.push('')
	        j++
	      }else{
	        boardArr.push(temp)
	        temp = ['']
	        j = 1
	        }
	      }
	  boardArr.push(temp)
	  console.log('we created the array')
	} 

	const setGrid = (size) => {
		document.documentElement.style.setProperty("--colNum", size);
		for(var i = 0; i < size * size; i++){
			let d = document.createElement("div");
			d.id = i 
	    	d.className = "box"
	  //   	let vRatio = (10 / size)
			// let contentHeight = "height: " + vRatio.toString()
			// console.log(contentHeight)
			// console.log('the size is ' + size + ' so the vRatio is ' + vRatio)
	    
	    if(i < size * size - size){
	      d.setAttribute("style", "border-bottom: 4px solid white;")
	    }
	   	
	    if(i % size !== 0 && i > 0){
	      let style = d.style.cssText
	      d.setAttribute("style", style + "border-left: 4px solid white;")
	    }
	    // d.setAttribute("style", style + "height: " + contentHeight)
	    let content = document.createElement("div")
	    content.className = "content"
	    content.id = i
	    let marker = document.createElement("div")
	    marker.className = 'marker'
	    // marker.textContent = i
	    content.appendChild(marker)
	    d.appendChild(content)
			// let style = d.style.cssText
			// d.setAttribute("style", style + "display: flex; align-items: center; justify-content: center;")
		board.appendChild(d)
		}
	//set height of boxes to be % of viewport height
	}
	const setGridSize = () => {
	const sizeVal = size.value
		if(sizeVal >= 3 && sizeVal <= 10){
			setGrid(sizeVal)
		}else{
			//flash message to enter valid size
		} 
	}

	const styleColumns = () => {
		let boxes = document.querySelectorAll('.box')
		let bStyle = boxes[0].style.cssText

		for(var i = 0 ; i < boxes.length; i++){
			var b = boxes[i]
			var BS = b.style.cssText
			if(i % size.value !== 0  && i > 0){
				b.setAttribute("style", BS + "height: 80px; width: 100%; border-left: 4px solid white;")
			}else{
				b.setAttribute("style", BS + "height: 80px; width: 100%")
			}
		}
	}
	return {setGridSize, setBoardArr, setGrid, styleColumns}
})()




const events = ( () => {	
	const hasNames = ( () => {
		console.log('you click body!')
		if(p1Name.value !== '' && p2Name.value !== ''){
			return true
		}else{
			return false
		}
	})
	const body = document.querySelector('body')
	return {hasNames, body}
})()

const players = ( () => {
	const first = {}
	const second = {}
	return {first, second}
})()

const messages = (() => {
	const checkBoardArr = () => {
		for(let i = 0; i < boardArr.length; i++){
			let current = boardArr[i]
			if(Array.isArray(current)){
				checkBoardArr(current)
			}else if(current !== ''){
				return true
			}
		}
		return false
	}

	const sayEnterNames = () => {
		flash.textContent = 'Enter both your names'
	}
	const sayGoP1 = () => {
		flash.textContent = players.first.name + "'s turn"
	}

	const sayGoP2 = () => {
		flash.textContent = players.second.name + "'s turn"
	}
	const saySetSize = () => {
		flash.textContent = 'Choose your grid size'
	}
	const sayTurn = () => {
		if(game.status){
			if(game.turn === 'p1'){
				sayGoP1()
			}else{
				sayGoP2()
			}
		}
	}
	const sayWinner = () =>{
		let winner = ''
		if(game.turn === 'p1'){
			winner = players.second.name
		}else{
			winner = players.first.name
		}
		flash.textContent = winner + '  WINS!!!'
	}
	return {checkBoardArr, sayEnterNames, sayGoP1, sayGoP2, saySetSize, sayTurn, sayWinner}
})()

//ADD LISTENERS to each box that change marker, add to board array
const setMarker = () => {
	if(game.status){
		if(game.turn === 'p1'){
	  		game.turn = 'p2'
	  		return 'X'
	  	}else{
	  		game.turn = 'p1'
	  		return 'O'
	  	}	
	}
}

const addListeners = () =>{
  const content = document.querySelectorAll(".content")
  for(let i = 0; i < content.length; i++){
    let marker = content[i]
    marker.addEventListener('click', () => {
      let currentMarker = setMarker()
      if(['X', 'O'].includes(marker.textContent) === false && game.status){
      	marker.firstChild.textContent = currentMarker
      	game.changeTurn()

      	//push marker to board array

      }
      	let gridWidth = boardArr[0].length
      	let arrRow = Math.floor(marker.id / gridWidth)
      	let arrCol = marker.id - arrRow * gridWidth
      	boardArr[arrRow][arrCol] = marker.firstChild.textContent
    })
  }
}

const clearBoard = (board) => {
	boardArr = []
}
board.addEventListener('click', messages.sayTurn)

reset.addEventListener("click", () => {
	clearBoard(boardArr)
	game.turn = 'p1'
	game.status = false
	players.first.turn = true
	players.second.turn = false
	reset.classList.toggle("none")
	board.innerHTML = ''
	startButton.classList.toggle('none')
})

const updateScore = () => {
	if(players.first.winner){
		p1Score.textContent = parseInt(p1Score.textContent) + 1
		players.first.score += 1
	}else{
		p2Score.textContent = parseInt(p2Score.textContent) + 1
		players.first.score += 1
	}
}


const checkWinner = () => {
	let currentMarker
	if(game.marker() === 'X'){
		currentMarker = 'O'
	}else{
		currentMarker = 'X'
	}

	if(checkGrid(currentMarker) && !players.first.winner && !players.second.winner){
		messages.sayWinner()
		game.status = false
		console.log('we have a winner')
		if(players.first.turn){
			players.second.winner = true
		}else{
			players.first.winner = true
		}
		updateScore()
		return true
	}

	return false
}

const gameBoard = document.querySelector('.gameBoard')
gameBoard.addEventListener('click', checkWinner)
const checkGrid = (marker) => {
  //check horizontal
  for(let i = 0; i < boardArr.length; i++){
    let row = boardArr[i]
    if(row.filter( (el) => el === marker).length === row.length){
    	console.log('HORIZONTAL')
      return true
    }
  }
  //check vertical
  for(let i = 0; i < boardArr.length; i++){
    let col = []
    for(let j = 0; j < boardArr.length; j++){
      col.push(boardArr[j][i])
    }
    if(col.filter( (el) => el === marker).length === col.length){
    	console.log('VERTICAL')
      return true
    }
    col = []
  }
  //check diagonal
  for(let i = 0; i < boardArr.length - 1; i++){
    let current = boardArr[i][i]
    let next = boardArr[i+1][i+1]
    console.log('running diagonal check 1')
    if(current !== next && current!== ''){
      console.log('we stopped checking diagonal 1')
      break
    }
    if(i === boardArr.length - 2 && current === next && current !== ''){
    	console.log('DIAGONAL 1')
      return true
    }
  }
  // check other diagonal
  let j = 0
  for(let i = boardArr.length-1; i > 0; i--){
    let current = boardArr[j][i]
    let next = boardArr[j+1][i-1]
    if(current !== next){
      break
    }
    if(i === 1 && current!== ''){
    	console.log('DIAGONAL 2')
      return true
    }
    j++
  }
  return false
}

// PlAYER OBJECTS
const p1Name = document.getElementById("p1")
const p2Name = document.getElementById("p2")
const Player = (name, marker) => {
		this.name = name
		this.marker = marker
		this.winner = false
		this.score = 0 
		this.turn = false
		return {name, marker, winner, score, turn} 
}

const game = ( () => {
	const status = false
	const turn = 'p1'
	const marker = () => {
		if(players.first.turn){
			return players.first.marker
		}else{
			return players.second.marker
		}
	}
	const changeTurn = () => {
		if(!checkWinner()){
			console.log('no winner second player turn')
			if(players.first.turn){
				players.first.turn = false
				players.second.turn = true
				game.turn = 'p2'
			}else{
				players.first.turn = true
				players.second.turn = false
				game.turn = 'p1'
			}
		}
	}
	
	return {turn, marker, status, changeTurn}
})()








