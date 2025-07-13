
export default {
  basePath: 'https://horasplanetareas.github.io/horas-planetarias',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
