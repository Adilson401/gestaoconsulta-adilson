import express from 'express';
import { UsuarioController } from './controllers/UsuarioController.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export function createApp(prisma) {
  const app = express();
  app.use(express.json());
  app.use(requestLogger);//esta no helper, e esta sendo chamado aqui para garantir que todas as requisições sejam logadas, independentemente da rota ou do controlador que as manipule.

  const usuarioController = new UsuarioController(prisma);

  app.post('/usuarios', (req, res) => usuarioController.cadastrar(req, res));
  app.get('/usuarios', (req, res) => usuarioController.listar(req, res));
  app.get('/usuarios/pesquisar', (req, res) => usuarioController.pesquisar(req, res));
  app.put('/usuarios/:id', (req, res) => usuarioController.atualizar(req, res));
  app.delete('/usuarios/:id', (req, res) => usuarioController.deletar(req, res));

  //trouxe o notFoundHandler e errorHandler para cá, para garantir que eles sejam aplicados a todas as rotas definidas no app, e para centralizar o tratamento de erros e rotas não encontradas em um único lugar.
  //estar ser chamado pelo helper
  app.use(notFoundHandler);//esta no helper, e esta sendo chamado aqui para garantir que todas as requisições que não correspondam a nenhuma rota definida sejam tratadas pelo notFoundHandler, retornando uma resposta adequada para o cliente.
  app.use(errorHandler);

  return app;
}
