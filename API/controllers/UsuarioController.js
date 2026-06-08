import pkg from '@prisma/client';
import { UsuarioService } from '../services/usuarioService.js';

const { Prisma } = pkg;

export class UsuarioController {
  constructor(prisma) {
    this.usuarioService = new UsuarioService(prisma);
  }

  // Método para cadastrar um novo usuário
  async cadastrar(req, res) {
    try {
      const result = await this.usuarioService.cadastrar(req.body);
      if (result?.error) {
        return res.status(result.status).json({ error: result.error });
      }
      return res.status(201).json(result);
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return res.status(409).json({ error: 'Email já cadastrado.' });
      }
      return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
  }

  // Método para listar usuários cadastrados
  async listar(req, res) {
    try {
      const usuarios = await this.usuarioService.listar();
      return res.json(usuarios);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
  }

  // Método para atualizar um usuário existente
  async atualizar(req, res) {
    const { id } = req.params;
    try {
      const result = await this.usuarioService.atualizar(id, req.body);
      if (result?.error) {
        return res.status(result.status).json({ error: result.error });
      }
      return res.json(result);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
      return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
  }

  // Método para pesquisar usuários por filtro
  async pesquisar(req, res) {
    try {
      const result = await this.usuarioService.pesquisar(req.query);
      if (result?.error) {
        return res.status(result.status).json({ error: result.error });
      }
      return res.json(result);
    } catch (error) {
      console.error('Erro ao pesquisar usuários:', error);
      return res.status(500).json({ error: 'Erro ao pesquisar usuários.' });
    }
  }

  // Método para deletar um usuário existente
  async deletar(req, res) {
    const { id } = req.params;
    try {
      await this.usuarioService.deletar(id);
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
      return res.status(500).json({ error: 'Erro ao deletar usuário.' });
    }
  }
}