import { UsuarioRepository } from '../repositories/usuarioRepository.js';
import {
  parseUsuarioRequest,
  parseUsuarioSearchQuery,
  parseDateRange,
} from '../helpers/usuarioHelpers.js';

// Service para gerenciar a lógica de negócios relacionada aos usuários, 
// o que service faz é atuar como uma camada intermediária entre os controllers e o repositório, 
// garantindo que as regras de negócio sejam aplicadas corretamente antes de interagir com a base de dados.
export class UsuarioService {
  constructor(prisma) {
    this.repository = new UsuarioRepository(prisma);
  }

  // Método para cadastrar um novo usuário, recebe os dados do usuário, 
  // valida e formata usando parseUsuarioRequest, e então chama o repositório para criar o usuário no banco de dados.
  //O repository esta sendo injectado com que nome? prisma, e o service esta usando esse repository para realizar as operações de CRUD e pesquisa.
  async cadastrar(body) {
    const parsed = parseUsuarioRequest(body);
    if (parsed.error) {
      return { error: parsed.error, status: 400 };
    }

    return this.repository.criar(parsed);
  }

  async listar() {
    return this.repository.listar();
  }

  async atualizar(id, body) {
    const parsed = parseUsuarioRequest(body, { partial: true });
    if (parsed.error) {
      return { error: parsed.error, status: 400 };
    }

    return this.repository.atualizar(id, parsed);
  }

  async deletar(id) {
    return this.repository.deletar(id);
  }

  async pesquisar(query) {
    const filters = parseUsuarioSearchQuery(query);
    if (!filters.nome && !filters.email && !filters.datanascimento) {
      return {
        error: 'Informe nome, email ou datanascimento para pesquisar.',
        status: 400,
      };
    }

    const searchParams = {
      nome: filters.nome,
      email: filters.email,
    };

    if (filters.datanascimento) {
      const dateRange = parseDateRange(filters.datanascimento);
      if (dateRange.error) {
        return { error: dateRange.error, status: 400 };
      }
      searchParams.dataRange = dateRange;
    }

    return this.repository.pesquisar(searchParams);
  }
}
