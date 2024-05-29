document.addEventListener("DOMContentLoaded", 
function(){
    //#region IMAGE LOADING
    const imgOptions = {};
    const imgObserver = new IntersectionObserver((entries, imgObserver) => {
        entries.forEach((entry) =>{
            if(!entry.isIntersecting) return;
            const img = entry.target;
            let dataImage = img.getAttribute("data-image");
            img.src = dataImage;
            imgObserver.unobserve(img);
        })
    },imgOptions)
    //#endregion
    //#region API CONSUME WITH FETCH
    const fetchPokemons = async(endpoint) => {
        let data;
        try{
            const response = await fetch(endpoint, {
                method: "GET",
                headers: {
                    "Content-Type":"application/json"
                }
            })
            data = await response.json();
        } catch(error){
            console.log(error);
        }
        return data.pokemon_species;
    };
    //#endregion
    //#region GET POKEMON NUMBERS
    function orderPokemonNumber(string){
        let substring = string.substring(
            string.lastIndexOf("s/")+2,string.lastIndexOf("/")
        )
        return substring;
    }
    //#endregion
    //#region  ADD POKEMONS TO HTML
    async function getPokemon(generationNumber, toggle){
        let endpoint = `https://pokeapi.co/api/v2/generation/${generationNumber}/`;
        let container = document.getElementById('container');
        container.innerHTML = "";
        let pokemons = []
        pokemons = await fetchPokemons(endpoint);
        for(let i = 0; i < pokemons.length; i++){
            pokemons[i].nr = orderPokemonNumber(pokemons[i].url);
        }
        pokemons.sort((a,b) => a.nr-b.nr)
        pokemons.forEach((pokemon) =>{
            let number3dec = orderPokemonNumber(pokemon.url)
            if(number3dec<10){
                number3dec = "0" + number3dec;
            }
            if(number3dec<100){
                number3dec = "0" + number3dec
            }
            let img = new Image()
            const toggleurl = toggle?"https://assets.pokemon.com/assets/cms2/img/pokedex/full/"
            : "https://www.serebii.net/pokemongo/pokemon/";
            img.src="https://i.gifer.com/origin/28/2860d2d8c3a1e402e0fc8913cd92cd7a_w200.gif";
            const urlimage=`${toggleurl}${number3dec}.png`;
            img.setAttribute("data-image",urlimage);
            img.setAttribute("class", "pokeimage");
            img.setAttribute("alt", pokemon.name);

            let divitem = document.createElement("li");
            divitem.classList.add("item");
            divitem.innerHTML = `<div> ${orderPokemonNumber(pokemon.url)}-${pokemon.name}</div>`;
            divitem.appendChild(img);
            container.appendChild(divitem)
            imgObserver.observe(img);
        })
    }
    //#endregion
    //#region POKEMON GENERATION
    let number = 1;
    getPokemon(number);
    let toggle = false;
    const btnicon = document.getElementById("btnicon");
    btnicon.addEventListener("click", function(){
        toggle = !toggle;
        getPokemon(number, toggle);
    });
    btnicon.addEventListener
    let geners = ["generation-1","generation-2","generation-3","generation-4","generation-5","generation-6","generation-7"];
    let filters = document.getElementById("filters");
    let gen ="";
    for(let i=0; i<geners.length; i++){
        gen += `
        <input class="radio-gens" type="radio" id="${geners[i]}" value=${i+1} name="generation" checked>
        <label for="${geners[i]}" class="label-gens">${geners[i]}</label>
        `
    }
    filters.innerHTML = gen;
    filters.addEventListener("click", function(e){
        let target = e.target.type;
        if(target == "radio"){
            getPokemon(e.target.value, toggle);
            title.innerHTML = "Pokemon " + e.target.id;
        }
    })
    //#endregion
});