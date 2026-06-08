export class UsuarioRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
// Método para criar um novo usuário, recebe os dados do usuário e chama o método create do Prisma para inserir um novo registro na coleção de usuários no banco de dados.
  async criar({ nome, morada, email, datanascimento, passwordHash, funcaoId, status }) {
    return this.prisma.usuario.create({
      data: {
        nome,
        morada,
        email,
        datanascimento,
        passwordHash,
        funcaoId,
        status,
      },
    });
  }
// Método para listar todos os usuários cadastrados, chama o método findMany do Prisma para buscar todos os registros da coleção de usuários no banco de dados.
  async listar() {
    return this.prisma.usuario.findMany();
  }
// Método para atualizar um usuário por ID, recebe o ID do usuário e os dados atualizados, e chama o método update do Prisma para atualizar o registro no banco de dados.
  async atualizar(id, { nome, morada, email, datanascimento, passwordHash, funcaoId, status }) {
    return this.prisma.usuario.update({
      where: { id },
      data: {
        nome,
        morada,
        email,
        datanascimento,
        passwordHash,
        funcaoId,
        status,
      },
    });
  }
// Método para deletar um usuário por ID
  async deletar(id) {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
// Método para pesquisar usuários por nome, email ou data de nascimento
  async pesquisar({ nome, email, dataRange }) {
    const where = {};

    if (nome) {
      where.nome = { contains: nome, mode: 'insensitive' };
    }

    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }

    if (dataRange) {
      where.datanascimento = {
        gte: dataRange.start,
        lte: dataRange.end,
      };
    }

    return this.prisma.usuario.findMany({ where });
  }
}
