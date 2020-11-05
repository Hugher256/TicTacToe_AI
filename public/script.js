const name = prompt('Enter player name: ')
// var data = { name }

// var options = {
// 	method: 'POST',
// 	body: JSON.stringify(data),
// 	headers: {
// 		'Content-Type': 'application/json',
// 	},
// }

async function getData() {
	const response = await fetch('/name')
	const dataR = await response.json()

	for (let i = 0; i < 5; i++) {
		n = document.querySelector('.names')
		let it = dataR[i]

		if (it != null && it != '' && it != ' ') {
			const trow = document.createElement('tr')
			const item = document.createElement('td')
			const count = document.createElement('td')
			trow.append(item)
			trow.append(count)
			n.append(trow)
			item.textContent = it.name
			count.textContent = it.matches
		}
	}
}

getData()

var cells = document.querySelectorAll('td')

var board = new Array(3)
var available = new Array(cells.length)

var winFlag = false
var winhead = document.querySelector('.winner')

var turn = 1
var matchesLost = 0

function setup() {
	cells.forEach((cell) => {
		cell.addEventListener('click', myfiller)
	})

	//Setting up the board array
	for (let i = 0; i < 3; i++) {
		board[i] = new Array(3)
		for (let j = 0; j < board[i].length; j++) {
			board[i][j] = 0
		}
	}

	//Array of available cells
	if (available.length < cells.length) {
		available = new Array(cells.length)
	}
	for (let i = 0; i < available.length; i++) {
		available[i] = i
	}
	console.log('Setup Done!')
}

function compPlayer() {
	if (available.length != 0 && turn % 2 == 1 && winFlag != true) {
		//AI code
		let bestScore = -Infinity
		let bestMove = null
		for (let i = 0; i < available.length; i++) {
			let removed = available[i]
			let x = cells[removed].cellIndex
			let y = (removed - x) / 3
			board[y][x] = 'X'
			available.splice(i, 1)
			let score = AI(board, 0, false, available)
			board[y][x] = 0
			available.push(removed)
			available.sort()
			if (score > bestScore) {
				bestScore = score
				bestMove = available[i]
				console.log('Best move was: ' + bestMove)
			}
		}
		cells[bestMove].textContent = 'X'
		let x = cells[bestMove].cellIndex
		let y = (bestMove - x) / 3
		board[y][x] = 'X'
		let index = available.indexOf(bestMove)
		available.splice(index, 1)
		winCheck(board)
		turn += 1
	}
}

function myfiller() {
	if (this.textContent == '' && turn % 2 == 0 && winFlag != true) {
		this.textContent = 'O'
		let x = this.cellIndex
		let y = 0
		for (let i = 0; i < cells.length; i++) {
			if (cells[i] == this) {
				available.splice(available.indexOf(i), 1)
				y = i
				break
			}
		}
		y = (y - x) / 3
		board[y][x] = 'O'
		winCheck(board)
		turn = +1
		compPlayer()
	}
}

function disEvt() {
	cells.forEach((cell) => {
		cell.removeEventListener('click', myfiller)
	})
	console.log('Disabled!')
}

function winCheck(arr) {
	//diagonal win check
	if (arr[0][0] == arr[1][1] && arr[0][0] == arr[2][2] && arr[1][1] != 0) {
		disEvt()
		winhead.textContent = arr[1][1] + ' is the winner!'
		winFlag = true
		if (arr[1][1] == 'X') {
			matchesLost += 1
			updateDb()
		}
		return arr[1][1]
	} else if (
		arr[0][2] == arr[1][1] &&
		arr[0][2] == arr[2][0] &&
		arr[1][1] != 0
	) {
		disEvt()
		winhead.textContent = arr[1][1] + ' is the winner!'
		winFlag = true
		if (arr[1][1] == 'X') {
			matchesLost += 1
			updateDb()
		}
		return arr[1][1]
	} else {
		//horizontal win check
		for (let i = 0; i < arr.length; i++) {
			for (let j = 0; j < 1; j++) {
				if (
					arr[i][j] == arr[i][j + 1] &&
					arr[i][j] == arr[i][j + 2] &&
					arr[i][j] != 0
				) {
					console.log('Winner! ' + arr[i][j])
					disEvt()
					winhead.textContent = arr[i][j] + ' is the winner!'
					winFlag = true
					if (arr[i][j] == 'X') {
						matchesLost += 1
						updateDb()
					}
					return arr[i][j]
				}
			}
		}
		//vertical win check
		for (let i = 0; i < 1; i++) {
			for (let j = 0; j < arr[0].length; j++) {
				if (
					arr[i][j] == arr[i + 1][j] &&
					arr[i][j] == arr[i + 2][j] &&
					arr[i][j] != 0
				) {
					console.log('Winner! ' + arr[i][j])
					disEvt()
					winhead.textContent = arr[i][j] + ' is the winner!'
					winFlag = true
					if (arr[i][j] == 'X') {
						matchesLost += 1
						updateDb()
					}
					return arr[i][j]
				}
			}
		}
		//base condition for a tie
		if (available.length == 0 && winFlag == false) {
			disEvt()
			winFlag = true
			winhead.textContent = ' It is a tie!'
			return null
		}
	}
}

function fake_winCheck(arr) {
	//base condition for a tie
	if (available.length == 0) {
		return null
	}

	//diagonal win check
	if (arr[0][0] == arr[1][1] && arr[0][0] == arr[2][2] && arr[1][1] != 0) {
		return arr[1][1]
	} else if (
		arr[0][2] == arr[1][1] &&
		arr[0][2] == arr[2][0] &&
		arr[1][1] != 0
	) {
		return arr[1][1]
	} else {
		//horizontal win check
		for (let i = 0; i < arr.length; i++) {
			for (let j = 0; j < 1; j++) {
				if (
					arr[i][j] == arr[i][j + 1] &&
					arr[i][j] == arr[i][j + 2] &&
					arr[i][j] != 0
				) {
					return arr[i][j]
				}
			}
		}
		//vertical win check
		for (let i = 0; i < 1; i++) {
			for (let j = 0; j < arr[0].length; j++) {
				if (
					arr[i][j] == arr[i + 1][j] &&
					arr[i][j] == arr[i + 2][j] &&
					arr[i][j] != 0
				) {
					return arr[i][j]
				}
			}
		}
	}
}

function res() {
	for (k of cells) {
		k.textContent = ''
	}
	winFlag = false
	winhead.textContent = ''
	setup()
	turn = 1
	compPlayer()
}

let scores = {
	X: 1,
	O: -1,
	null: 0,
}

function AI(boardcond, depth, maximizingPlayer, available_posi) {
	let result = fake_winCheck(boardcond)
	if (result != null && winFlag != true) {
		let score = scores[result]
		return score
	}
	if (maximizingPlayer == true) {
		//evaluation for maximizing player
		let bestScore = -Infinity
		for (let i = 0; i < available_posi.length; i++) {
			let removed = available_posi[i]
			let x = cells[removed].cellIndex
			let y = (removed - x) / 3
			boardcond[y][x] = 'X'
			available_posi.splice(i, 1)
			let score = AI(boardcond, depth + 1, false, available_posi)
			boardcond[y][x] = 0
			available_posi.push(removed)
			available.sort()
			bestScore = Math.max(score, bestScore)
		}
		return bestScore
	} else {
		//evaluation for minimizing player
		let bestScore = Infinity
		for (let i = 0; i < available_posi.length; i++) {
			let removed = available_posi[i]
			let x = cells[removed].cellIndex
			let y = (removed - x) / 3
			boardcond[y][x] = 'O'
			available_posi.splice(i, 1)
			let score = AI(boardcond, depth + 1, true, available_posi)
			boardcond[y][x] = 0
			available_posi.push(removed)
			available.sort()
			bestScore = Math.min(score, bestScore)
		}
		return bestScore
	}
}

async function updateDb() {
	var data = { name }
	data.matches = matchesLost
	console.log(data)

	await fetch(
		'/name',
		(options = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		})
	)
}

setup()
compPlayer()
