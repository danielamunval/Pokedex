const contenedor = document.getElementById("pokedex");
const agregarBtn = document.getElementById("agregarBtn");
const quitarBtn = document.getElementById("quitarBtn");
const buscarBtn = document.getElementById("buscarBtn");
const buscador = document.getElementById("buscador");

let contadorPokemon = 1;

async function obtenerPokemon(id) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();

    return {
      nombre: data.name,
      imagen: data.sprites.other["official-artwork"].front_default,
      tipo: data.types.map(t => t.type.name).join(", "),
      tipos: data.types.map(t => t.type.name),
      experiencia: data.base_experience,
      peso: data.weight,
      altura: data.height
    };
  } catch (error) {
    alert("Pokémon no encontrado");
    return null;
  }
}

function crearCarta(pokemon) {
  const div = document.createElement("div");
  div.classList.add("col", "fade-in");

  const tipoPrincipal = pokemon.tipos[0];
  const tipoClase = tipoPrincipal ? `bg-${tipoPrincipal}` : "";

  div.innerHTML = `
    <div class="card h-100 shadow-sm ${tipoClase}">
      <img src="${pokemon.imagen}" class="card-img-top bg-white" style="object-fit: contain; height: 200px;" alt="${pokemon.nombre}" />
      <div class="card-body">
        <h5 class="card-title text-capitalize">${pokemon.nombre}</h5>
        <p class="card-text"><strong>Tipo:</strong> ${pokemon.tipo}</p>
        <p class="card-text"><strong>Exp:</strong> ${pokemon.experiencia}</p>
        <p class="card-text"><strong>Peso:</strong> ${pokemon.peso} | <strong>Altura:</strong> ${pokemon.altura}</p>
        <button class="btn btn-outline-primary w-100 mt-2" onclick='addToFavorites(${JSON.stringify(pokemon)})'>❤️ Favorito</button>
      </div>
    </div>
  `;
  return div;
}

function addToFavorites(pokemon) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  favoritos.push(pokemon);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  alert(`${pokemon.nombre} agregado a favoritos`);
}

function mostrarFavoritos() {
  contenedor.innerHTML = "";
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  favoritos.forEach(poke => {
    const carta = crearCarta(poke);
    contenedor.appendChild(carta);
  });
}

function limpiarPokedex() {
  contenedor.innerHTML = "";
  localStorage.removeItem("favoritos");
  contadorPokemon = 1;
}

function crearBotonesFiltro() {
  const tipos = ["fire", "water", "grass", "electric", "psychic", "rock", "normal"];
  const contenedorFiltros = document.getElementById("filtrosTipo");

  tipos.forEach(tipo => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-secondary text-capitalize";
    btn.textContent = tipo;
    btn.onclick = () => filtrarPorTipo(tipo);
    contenedorFiltros.appendChild(btn);
  });
}

function filtrarPorTipo(tipoSeleccionado) {
  contenedor.innerHTML = "";
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const filtrados = favoritos.filter(p => p.tipos.includes(tipoSeleccionado));
  filtrados.forEach(poke => {
    const carta = crearCarta(poke);
    contenedor.appendChild(carta);
  });
}

// Eventos
agregarBtn.addEventListener("click", async () => {
  const pokemon = await obtenerPokemon(contadorPokemon);
  if (pokemon) {
    const carta = crearCarta(pokemon);
    contenedor.appendChild(carta);
    contadorPokemon++;
  }
});

quitarBtn.addEventListener("click", () => {
  const cartas = contenedor.querySelectorAll(".col");
  if (cartas.length > 0) {
    cartas[cartas.length - 1].remove();
    contadorPokemon--;
  }
});

buscarBtn.addEventListener("click", async () => {
  const valor = buscador.value.toLowerCase().trim();
  if (!valor) return;

  const pokemon = await obtenerPokemon(valor);
  if (pokemon) {
    const carta = crearCarta(pokemon);
    contenedor.appendChild(carta);
  }
});

// Al cargar
crearBotonesFiltro();
