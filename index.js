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
  inserirMusicaNaPagina(dados);
};


const inserirAnteriorEProximoNaPagina = ({ prev, next }) => {
  if (prev || next) {
    anteriorEProximo.innerHTML = `
      ${prev ? `<button class="btn btn-anterior" onClick="buscarMaisMusicas('${prev}')">Anteriores</button>` : ''}
      ${next ? `<button class="btn btn-proximo" onClick="buscarMaisMusicas('${next}')">Proximas</button>` : ''}
      `
    return
  }
  anteriorEProximo.innerHTML = '';
}


const inserirMusicaNaPagina = ({ data, prev, next }) => {
  musicasContainer.innerHTML = data.map(({ artist: { name }, title }) =>
    ` 
    <li class="musica"> 
      <span class="musica-artista">
      <strong> ${name} </strong> - ${title} 
      </span>
      <button class="btn" data-artista="${name}" data-titulo-musica="${title}">Veja Letra</button>
    </li>

    `).join('');

  inserirAnteriorEProximoNaPagina({ prev, next });
}

const inserindoLetraDaMusicaNaPagina = ({ letraDaMusicaFormatada, tituloDaMusica, nomeDoArtista }) => {
  if (letraDaMusicaFormatada === '') {
    musicasContainer.innerHTML = `
      <li>
        <h2 class="texto-claro">Desculpa letra <strong class="texto-escuro">(${tituloDaMusica})</strong> não encontrado</h2>
      </li>
    `
    return
  }


  musicasContainer.innerHTML = `
  <li>
    <h2><strong>${tituloDaMusica}</strong> - ${nomeDoArtista}</h2>
    <p class="musica">${letraDaMusicaFormatada}</p>
  </li>
`
}

const fetchMusicas = async (nomeDoArtista, tituloDaMusica) => {
  const dados = await fetchDados(`${apiUrl}/v1/${nomeDoArtista}/${tituloDaMusica}`)
  const letraDaMusicaFormatada = dados.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  inserindoLetraDaMusicaNaPagina({ letraDaMusicaFormatada, nomeDoArtista, tituloDaMusica });
}

const lidandoComClickNoContainerMusica = e => {
  const elementoClicado = e.target;
  if (elementoClicado.tagName === 'BUTTON') {
    const nomeDoArtista = elementoClicado.getAttribute('data-artista');
    const tituloDaMusica = elementoClicado.getAttribute('data-titulo-musica');
    anteriorEProximo.innerHTML = '';
    fetchMusicas(nomeDoArtista, tituloDaMusica);
  }
}
musicasContainer.addEventListener('click', lidandoComClickNoContainerMusica);


const fetchLetraDeMusicas = async (termo) => {
  const dados = await fetchDados(`${apiUrl}/suggest/${termo}`);
  inserirMusicaNaPagina(dados)
}


const lidandoComClickNoForm (e) => {
  e.preventDefault();

  const termoDaBusca = inputSearch.value.trim();
  if (!termoDaBusca) {
    musicasContainer.innerHTML = `<li class="aviso-vermelho">Por favor digite um termo valido</li>`
    return
  }

  fetchLetraDeMusicas(termoDaBusca);

}
form.addEventListener('submit', lidandoComClickNoForm);
