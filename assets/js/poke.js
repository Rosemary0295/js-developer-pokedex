function getPokemonNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("pokemon");
}

function showPokemonDetail(pokemon) {
    const div = document.getElementById("pokemonDetail");
    div.innerHTML = `
        <h2 class = "name-poke">${pokemon.name}</h2>
        <div class="details-poke">
        <img class = "img-poke" src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
        <p><strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
        <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
        <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
        <p><strong>Abilities:</strong> ${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
        <p><strong>Moves:</strong> ${pokemon.moves.map(m => m.move.name).join(', ')}</p>
        <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
        </div>
        `;
}

const pokemonName = getPokemonNameFromURL();

fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then(response => response.json())
    .then(showPokemonDetail)
    .catch(err => console.error("Erro ao carregar detalhes", err));

    const button = document.getElementById("voltar");

    function botaoVoltar() {
       window.location.href = "/";
    }

    button.addEventListener("click", botaoVoltar);