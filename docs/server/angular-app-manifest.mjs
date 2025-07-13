
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/horas-planetarias/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/horas-planetarias/hora-actual",
    "route": "/horas-planetarias"
  },
  {
    "renderMode": 2,
    "route": "/horas-planetarias/hora-actual"
  },
  {
    "renderMode": 2,
    "route": "/horas-planetarias/lista-horas"
  },
  {
    "renderMode": 2,
    "route": "/horas-planetarias/detalle-hora"
  },
  {
    "renderMode": 2,
    "redirectTo": "/horas-planetarias/hora-actual",
    "route": "/horas-planetarias/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 5032, hash: '12974b0eefe3e43e68ee9f4147154ec4c02de2ae4d09ba44d8f87d8b82fb7956', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 5545, hash: '585bf1f5b35da1c72ca0dda0a6062da0efe0939ceff331ddd5799791e3a3585c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'detalle-hora/index.html': {size: 9587, hash: '6446d6ec202f9f081a111ddfbebe767caa8481c35c08756533322aee13fe20f0', text: () => import('./assets-chunks/detalle-hora_index_html.mjs').then(m => m.default)},
    'hora-actual/index.html': {size: 9361, hash: '1ff43f2808c8db9149582c7ce8230f2fb4acde19da895b67ed7a28849aa61bb8', text: () => import('./assets-chunks/hora-actual_index_html.mjs').then(m => m.default)},
    'lista-horas/index.html': {size: 16555, hash: 'f7f22bfe52b270f81ac080d188eac73c17d25bbe22169d385bcf254c49af72e6', text: () => import('./assets-chunks/lista-horas_index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
