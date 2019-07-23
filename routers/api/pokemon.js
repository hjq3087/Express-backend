const express = require('express')
const router = express.Router()
const fs = require('fs')

const loadPokemons = () => {
    let todoJSON = fs.readFileSync('./db/pokemons.json')
    let todoList = JSON.parse(todoJSON)
    return todoList
}

const loadTopList = () => {
    let topListJSON = fs.readFileSync('./db/toplist.json')
    let topList = JSON.parse(topListJSON)
    return topList
}

const pokemonsList = loadPokemons()
const topList = loadTopList()


const allPokemons = (req, res) => {
    res.json(pokemonsList)
}

const sendTopList = (req, res) => {
    res.json(topList)
}

const addPokemonToTopList = (req, res) => {
    const pokemon  = req.body
    let { id } = pokemon
    if (isIdExist(id, topList)) {
        handleIdExited(id, res)
    } else {
        topList.push(pokemon)
        savePokemonsList(topList)
        res.json(topList)
    }
}

const savePokemonsList = (list) => {
    let pokemons = JSON.stringify(list, null, 2)
    fs.writeFileSync('./db/toplist.json', pokemons)
}

const handleId = id => {
    if (id < 10) {
        return `00${id}`
    } else if (id < 100) {
        return `0${id}`
    } else {
        return `${id}`
    }
}

const isIdExist = (id, list) => {
    return list.some(listItem => listItem.id === id)
}

const handleIdNotFound = (id, response) => {
    let idNotFoundMsg = {
        msg: `There is not pokemon with ${id}.`
    }
    response.status(400).json(idNotFoundMsg)
}

const handleIdExited = (id, response) => {
    let idExitedMsg = {
        msg: `Your already add pokemon id = ${id} to the top list.`
    }
    response.status(400).json(idExitedMsg)
}


const handleIdAndAction = (req, res, actionFunc, list) => {
    let id = parseInt(req.params.id, 10)
    id = handleId(id)
    let isFounded = isIdExist(id, list)
    if (isFounded) {
        actionFunc(req, res, id)
    } else {
        handleIdNotFound(id, res)
    }
}


const sendPokemon = (req, res, id) => {
    let pokemon = pokemonsList.filter(item => item.id === id)
    res.json(pokemon)
}

const deletePokemon = (req, res, id) => {
    let index = topList.findIndex(pokemon => pokemon.id === id)
    topList.splice(index, 1)[0]
    savePokemonsList(topList)
    res.json(topList)
}
router.get('/all', (req, res) => {
    allPokemons(req, res)
})

router.get('/toplist', (req, res) => {
    sendTopList(req, res)
})

router.get('/:id', (req, res) => {
    handleIdAndAction(req, res, sendPokemon, pokemonsList)
})

router.get('/toplist/delete/:id', (req, res) => {
    handleIdAndAction(req, res, deletePokemon, topList)
})

// add pokemon to toplist
router.post('/toplist/add', (req, res) => {
    addPokemonToTopList(req, res)
})


module.exports = router