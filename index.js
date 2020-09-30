const url = `https://api.lyrics.ovh`;

const form = document.querySelector('.form');
const inputSearch = document.querySelector('.search');
const btn = document.querySelector('.busca-btn');
const musicasContainer = document.querySelector('.musicas-container');
const anteriorEProximo = document.querySelector('.anterior-e-proximo');


const buscarMaisMusicas = async (url) => {
  const resposta = await fetch(url);
  const data = await resposta.json();
}

const inserindoMusicasNaPagina = (musicas) => {
  musicasContainer.innerHTML = musicas.data.map(musica =>
    ` 
    <li class="musica"> 
    <span class="musica-artista">
    <strong> ${musica.artist.name} </strong> - ${musica.title} 
    </span>
    <button class="btn">Veja Letra</button>
    </li>

    `).join('');

    if(musicas.prev || musicas.next){
      anteriorEProximo.innerHTML = `
      ${musicas.prev ? `<button class="btn btn-proximo" onClick="buscarMaisMusicas('${musicas.prev}')">Anteriores</button>` : ''}
      ${musicas.next ? `<button class="btn btn-proximo" onClick="buscarMaisMusicas('${musicas.next}')">Proximas</button>` : ''}
      `
      return
    }

}

const fetchLetraDeMusicas = async (termo) => {
  const resposta = await fetch(`${url}/suggest/${termo}`);
  const respostaJson = resposta.ok ? resposta.json() : Promise.reject(statusText);
  const dados = await respostaJson;

  inserindoMusicasNaPagina(dados)

}


form.addEventListener('submit', function (e) {
  e.preventDefault();

  const termoDaBusca = inputSearch.value.trim();
  if (!termoDaBusca) {
    musicasContainer.innerHTML = `<li class="aviso-vermelho">Por favor digite um termo valido</li>`
    return
  }

  fetchLetraDeMusicas(termoDaBusca);

})
