const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const searchInput = document.querySelector('.input');
const searchButton = document.querySelector('.btnSearch');
const clearButton = document.querySelector('btnClear')

const maxRecords = 1025;
const limit = 15;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onclick="window.open('/pokedex.html?pokemon=${pokemon.name}', '_blank')">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join("")}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml

        if ((offset + limit) >= maxRecords){
            loadMoreButton.style.display = "none"
        }

    })
}

async function getPokemon() {
    const query = searchInput.value.trim().toLowerCase();

    if (query === "") {
        clearSearch();
        return;
    }

    pokemonList.innerHTML = "";
    loadMoreButton.style.display = "none";

    if (!isNaN(query)) {
        const id = parseInt(query);
        if (id < 1 || id > MAX_POKEMONS) {
            alert(`O ID deve ser entre 1 e ${MAX_POKEMONS}.`);
            return;
        }

        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            const pokemon = convertPokeApiDetailToPokemon(data);
            pokemonList.innerHTML = pokemonToLi(pokemon);
            return;
        } catch {
            alert("Pokémon não encontrado por ID.");
            return;
        }
    }

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if (res.ok) {
            const data = await res.json();
            const pokemon = convertPokeApiDetailToPokemon(data);
            pokemonList.innerHTML = pokemonToLi(pokemon);
            return;
        }
    } catch {}

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${query}`);
        if (!res.ok) throw new Error("Tipo inválido");

        const data = await res.json();

        const pokemonPromises = data.pokemon
            .slice(0, 30) 
            .map(async (entry) => {
                const res = await fetch(entry.pokemon.url);
                const pokeData = await res.json();
                return convertPokeApiDetailToPokemon(pokeData);
            });

        const pokemons = await Promise.all(pokemonPromises);
        const html = pokemons.map(pokemonToLi).join("");
        pokemonList.innerHTML = html;
    } catch {
        alert("Nenhum Pokémon, ID ou tipo encontrado.");
    }
}

function clearSearch() {
    searchInput.value = "";
    pokemonList.innerHTML = "";
    offset = 0;
    loadMoreButton.style.display = "block";
    loadPokemonItens(offset, limit);
}

searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        getPokemon();
    }
});



loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

searchButton.addEventListener("click", getPokemon);
clearButton.addEventListener("click", clearSearch);
loadMoreButton.addEventListener("click", () => {
    offset += limit;
    loadPokemonItens(offset, limit);
});