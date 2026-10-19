const MAX_TENTATIVAS = 3;

export default class Autenticacao {
  constructor() {
    this.usuarios = [];
    this.usuarioLogado = null;
  }

  cadastrar(email, senha) {
    if (!email || !email.includes('@')) {
      throw new Error('E-mail inválido');
    }
    if (!senha || senha.length < 6) {
      throw new Error('A senha deve ter pelo menos 6 caracteres');
    }
    if (this.usuarios.some((u) => u.email === email)) {
      throw new Error('E-mail já cadastrado');
    }

    const usuario = { email, senha, tentativas: 0, bloqueado: false };
    this.usuarios.push(usuario);
    return { email };
  }

  login(email, senha) {
    const usuario = this.usuarios.find((u) => u.email === email);

    if (!usuario) {
      throw new Error('Usuário ou senha inválidos');
    }
    if (usuario.bloqueado) {
      throw new Error('Conta bloqueada');
    }

    if (usuario.senha !== senha) {
      usuario.tentativas += 1;
      if (usuario.tentativas >= MAX_TENTATIVAS) {
        usuario.bloqueado = true;
      }
      throw new Error('Usuário ou senha inválidos');
    }

    usuario.tentativas = 0;
    this.usuarioLogado = { email };
    return this.usuarioLogado;
  }

  logout() {
    this.usuarioLogado = null;
  }

  estaAutenticado() {
    return this.usuarioLogado !== null;
  }
}
