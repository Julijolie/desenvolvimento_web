document.addEventListener("DOMContentLoaded", () => {
    const pokeContainer = document.querySelector("#pokeContainer");
    const filterButtonsContainer = document.querySelector("#filter-buttons");
    const pokemonCount = 150;
    const colors = {
        fire: '#FDDFDF',
        grass: '#DEFDE0',
        electric: '#FCF7DE',
        water: '#DEF3FD',
        ground: '#f4e7da',
        rock: '#d5d5d4',
        fairy: '#fceaff',
        poison: '#98d7a5',
        bug: '#f8d5a3',
        dragon: '#97b3e6',
        psychic: '#eaeda1',
        flying: '#F5F5F5',
        fighting: '#E6E0D4',
        normal: '#F5F5F5'
    };

    const mainTypes = Object.keys(colors);
    let allPokemons = []; // Armazena todos os Pokémons carregados

    // Carrega todos os Pokémons ao iniciar
    const fetchPokemons = async () => {
        pokeContainer.innerHTML = ""; // Limpa o container
        for (let i = 1; i <= pokemonCount; i++) {
            const pokemon = await getPokemons(i);
            allPokemons.push(pokemon); // Armazena o Pokémon
        }
        createFilterButtons(); // Gera os botões após carregar todos os Pokémons
    };

    // Busca Pokémon por ID e retorna os dados
    const getPokemons = async (id) => {
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        const resp = await fetch(url);
        const data = await resp.json();
        createPokemonCard(data); // Cria os cards iniciais
        return data; // Retorna os dados do Pokémon
    };

    // Cria os cards de Pokémon
    const createPokemonCard = (poke) => {
        const card = document.createElement("div");
        card.classList.add("pokemon-card");
    
        const name = poke.name[0].toUpperCase() + poke.name.slice(1);
        const id = poke.id.toString().padStart(3, "0");
        const pokeTypes = poke.types.map((type) => type.type.name);
        const type = mainTypes.find((type) => pokeTypes.includes(type));
        const color = colors[type];
    
        card.innerHTML = `
            <div class="card-inner"> <!-- classe card-inner usada para controlar a rotação -->
                <div class="card-front" style="background-color: ${color};">
                    <div class="imgContainer">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png" alt="${name}">
                    </div>
                    <div class="info">
                        <span class="number">#${id}</span>
                        <h3 class="name">${name}</h3>
                        <small class="type">Type: <span>${type}</span></small>
                    </div>
                </div>
                <div class="card-back">
                    <img src="./back-card.png" alt="Pokemon Card Back">
                </div>
            </div>
        `;
        pokeContainer.appendChild(card);
    };
    

    // Cria botões de filtro com base nos tipos
    const createFilterButtons = () => {
        filterButtonsContainer.innerHTML = ""; // Limpa botões existentes
        mainTypes.forEach((type) => {
            const button = document.createElement("button");
            button.textContent = type[0].toUpperCase() + type.slice(1); // Capitaliza o nome
            button.style.backgroundColor = colors[type];
            button.addEventListener("click", () => filterByType(type)); // Adiciona evento de clique
            filterButtonsContainer.appendChild(button);
        });
    };


    // Filtra os Pokémons pelo tipo selecionado
    const filterByType = (type) => {
        // Filtra Pokémons cujo tipo corresponde exatamente ao tipo selecionado
        const filtered = allPokemons.filter((poke) => 
            poke.types.length === 1 && poke.types[0].type.name === type || 
            poke.types.some((t) => t.type.name  == type)
        );
    
        // Exibe apenas os 10 primeiros Pokémons filtrados
        pokeContainer.innerHTML = "";
        filtered.slice(0, 10).forEach((poke) => createPokemonCard(poke));
    };
    

    // Busca por nome de Pokémon
    document.getElementById("pokemon-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = document.getElementById("pokemon-name").value.toLowerCase();

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const data = await response.json();

            if (response.ok) {
                // Limpa os resultados anteriores
                pokeContainer.innerHTML = "";
                createPokemonCard(data);
            } else {
                pokeContainer.innerHTML = "<p>Pokémon não encontrado</p>";
            }
        } catch (error) {
            pokeContainer.innerHTML = "<p>Erro ao buscar Pokémon</p>";
        }
    });

    fetchPokemons(); // Carrega todos os Pokémons ao iniciar
});
