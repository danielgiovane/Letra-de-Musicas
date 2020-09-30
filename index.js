const url = `https://api.lyrics.ovh`;

const form = document.querySelector('.form');
const inputSearch = document.querySelector('.search');
const btn = document.querySelector('.busca-btn');
const musicasContainer = document.querySelector('.musicas-container');
const anteriorEProximo = document.querySelector('.anterior-e-proximo');


const buscarMaisMusicas = async (url) => {
  const resposta = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const dados = await resposta.json();

  inserindoMusicasNaPagina(dados);
}

const inserindoMusicasNaPagina = (musicas) => {
  musicasContainer.innerHTML = musicas.data.map(musica =>
    ` 
    <li class="musica"> 
    <span class="musica-artista">
    <strong> ${musica.artist.name} </strong> - ${musica.title} 
    </span>
    <button class="btn" data-artista="${musica.artist.name}" data-titulo-musica="${musica.title}">Veja Letra</button>
    </li>

    `).join('');

  if (musicas.prev || musicas.next) {
    anteriorEProximo.innerHTML = `
      ${musicas.prev ? `<button class="btn btn-anterior" onClick="buscarMaisMusicas('${musicas.prev}')">Anteriores</button>` : ''}
      ${musicas.next ? `<button class="btn btn-proximo" onClick="buscarMaisMusicas('${musicas.next}')">Proximas</button>` : ''}
      `
    return
  }

}

const fetchMusicas = async (nomeDoArtista, tituloDaMusica) => {
  const resposta = await fetch(`${url}/v1/${nomeDoArtista}/${tituloDaMusica}`);
  const dados = await resposta.json();

  musicasContainer.innerHTML = `
    <li>
      <h2><strong>${tituloDaMusica}</strong> - ${nomeDoArtista}</h2>
      <p class="musica">${dados.lyrics}</p>
    </li>
  `

}

musicasContainer.addEventListener('click', e => {
  const elementoClicado = e.target;
  if (elementoClicado.tagName === 'BUTTON') {
    const nomeDoArtista = elementoClicado.getAttribute('data-artista');
    const tituloDaMusica = elementoClicado.getAttribute('data-titulo-musica');

    anteriorEProximo.innerHTML = '';

    fetchMusicas(nomeDoArtista, tituloDaMusica);
  }
})

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
