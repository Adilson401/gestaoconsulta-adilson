export function parseUsuarioRequest(body, options = {}) {
  const {
    nome,
    morada,
    email: emailField,
    'e-mail': emailHyphen,
    datanascimento,
    idade,
    senha,
    password,
    passwordHash,
    funcaoId,
    status,
  } = body;

  const email = emailField ?? emailHyphen;
  let dataNascimento = datanascimento;
  let senhaValor = password ?? senha ?? passwordHash;

  if (!dataNascimento && typeof idade !== 'undefined') {
    const years = Number(idade);
    if (!Number.isFinite(years) || years <= 0) {
      return { error: 'Idade inválida.' };
    }

    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - years);
    dataNascimento = birthDate.toISOString();
  }

  if (!options.partial) {
    if (!nome || !email || !dataNascimento || !senhaValor || !status) {
      return {
        error:
          'Os campos nome, email, datanascimento, password e status são obrigatórios.',
      };
    }
  }

  if (dataNascimento) {
    const parsedDate = new Date(dataNascimento);
    if (Number.isNaN(parsedDate.getTime())) {
      return { error: 'Data de nascimento inválida.' };
    }
    dataNascimento = parsedDate;
  }

  return {
    ...(nome ? { nome } : {}),
    ...(morada ? { morada } : {}),
    ...(email ? { email } : {}),
    ...(dataNascimento ? { datanascimento: dataNascimento } : {}),
    ...(senhaValor ? { passwordHash: senhaValor } : {}),
    ...(funcaoId ? { funcaoId } : {}),
    ...(status ? { status } : {}),
  };
}

export function parseUsuarioSearchQuery(query) {
  const nome = typeof query.nome === 'string' ? query.nome.trim() : undefined;
  const email = typeof query.email === 'string' ? query.email.trim() : undefined;
  const datanascimento =
    typeof query.datanascimento === 'string' ? query.datanascimento.trim() : undefined;

  return {
    nome: nome || undefined,
    email: email || undefined,
    datanascimento: datanascimento || undefined,
  };
}

export function parseDateRange(dateString) {
  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) {
    return { error: 'Data de nascimento inválida.' };
  }

  const start = new Date(parsedDate);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(parsedDate);
  end.setUTCHours(23, 59, 59, 999);

  return { start, end };
}
