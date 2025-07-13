
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
    'detalle-hora/index.html': {size: 9587, hash: 'f91483740db8e6fa4c08931ed296756dbcedc2b83accd348d005c71abaf05d44', text: () => import('./assets-chunks/detalle-hora_index_html.mjs').then(m => m.default)},
    'lista-horas/index.html': {size: 16555, hash: 'c102410336c4b3a23ac7af33ccd2eda2f42a88a3c20e8583d9405c9596b4cacd', text: () => import('./assets-chunks/lista-horas_index_html.mjs').then(m => m.default)},
    'hora-actual/index.html': {size: 9361, hash: 'a711db6aa8a731ce9f97d63e506f80e44dd74fd10470cf650b9fd6bacad66b9b', text: () => import('./assets-chunks/hora-actual_index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
