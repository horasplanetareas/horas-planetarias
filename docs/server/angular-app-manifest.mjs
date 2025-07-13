
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true
  baseHref: 'https://horasplanetareas.github.io/horas-planetarias
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
    'index.csr.html': {size: 5065, hash: 'b36afbc6f3e95e1fdf5d74c2c22b75605966d5061a877b339eed252c61d92b3e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 5578, hash: 'baf414f7326a47f7236bf634e23444d4260e6e492e7d1cb9d84f8f2e7e3c2e9f', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'detalle-hora/index.html': {size: 9688, hash: '85006e1320aea1570ee50ac10fcc75d537354217e50ad46a9fd87e7a6ce95909', text: () => import('./assets-chunks/detalle-hora_index_html.mjs').then(m => m.default)},
    'lista-horas/index.html': {size: 16656, hash: '441e5d58846d604b797816990784b302ca97c3f72f6fb5caa08a49be96aaec5a', text: () => import('./assets-chunks/lista-horas_index_html.mjs').then(m => m.default)},
    'hora-actual/index.html': {size: 9468, hash: '1236febf1b0207826ae7ae0c10139f3d06fae08fb4e393f6222daf435d9a2c4b', text: () => import('./assets-chunks/hora-actual_index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
