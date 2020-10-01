const apiUrl = `https://api.lyrics.ovh`;

const form = document.querySelector('.form');
const inputSearch = document.querySelector('.search');
const btn = document.querySelector('.busca-btn');
const musicasContainer = document.querySelector('.musicas-container');
const anteriorEProximo = document.querySelector('.anterior-e-proximo');


const fetchDados = async (url) => {
  const resposta = await fetch(url);
  const respostaJson = resposta.ok ? resposta.json() : Promise.reject(statusText);
  return await respostaJson;
}

const buscarMaisMusicas = async (url) => {
  const dados = await fetchDados(`https://cors-anywhere.herokuapp.com/${url}`)
  inserindoMusicasNaPagina(dados);
};

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

const inserindoLetraDaMusicaNaPagina = (musica) => {
  if (musica.letraDaMusicaFormatada === '') {
    musicasContainer.innerHTML = `
      <li>
        <h2 class="texto-claro">Desculpa letra <strong class="texto-escuro">(${musica.tituloDaMusica})</strong> não encontrado</h2>
      </li>
    `
    return
  }

  musicasContainer.innerHTML = `
  <li>
    <h2><strong>${musica.tituloDaMusica}</strong> - ${musica.nomeDoArtista}</h2>
    <p class="musica">${musica.letraDaMusicaFormatada}</p>
  </li>
`
}


const fetchMusicas = async (nomeDoArtista, tituloDaMusica) => {
  const dados = await fetchDados(`${apiUrl}/v1/${nomeDoArtista}/${tituloDaMusica}`)
  const letraDaMusicaFormatada = dados.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  inserindoLetraDaMusicaNaPagina({letraDaMusicaFormatada, nomeDoArtista, tituloDaMusica} );
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
  const dados = await fetchDados(`${apiUrl}/suggest/${termo}`);

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
