import Autenticacao from './Autenticacao';

describe('Autenticacao', () => {
  let auth;

  // Cada teste começa com uma instância nova, sem usuários
  beforeEach(() => {
    auth = new Autenticacao();
  });

  describe('cadastrar', () => {
    test('cadastra um usuário com dados válidos', () => {
      const usuario = auth.cadastrar('ana@email.com', '123456');

      expect(usuario).toEqual({ email: 'ana@email.com' });
    });

    test('não retorna a senha no resultado do cadastro', () => {
      const usuario = auth.cadastrar('ana@email.com', '123456');

      expect(usuario).not.toHaveProperty('senha');
    });

    test('lança erro para e-mail inválido', () => {
      expect(() => auth.cadastrar('anaemail.com', '123456')).toThrow('E-mail inválido');
    });

    test('lança erro para senha com menos de 6 caracteres', () => {
      expect(() => auth.cadastrar('ana@email.com', '123')).toThrow('pelo menos 6 caracteres');
    });

    test('não permite cadastrar o mesmo e-mail duas vezes', () => {
      auth.cadastrar('ana@email.com', '123456');

      expect(() => auth.cadastrar('ana@email.com', 'outrasenha')).toThrow('E-mail já cadastrado');
    });
  });

  describe('login', () => {
    beforeEach(() => {
      auth.cadastrar('ana@email.com', '123456');
    });

    test('faz login com e-mail e senha corretos', () => {
      const usuario = auth.login('ana@email.com', '123456');

      expect(usuario).toEqual({ email: 'ana@email.com' });
      expect(auth.estaAutenticado()).toBe(true);
    });

    test('recusa senha errada', () => {
      expect(() => auth.login('ana@email.com', 'errada')).toThrow('Usuário ou senha inválidos');
      expect(auth.estaAutenticado()).toBe(false);
    });

    test('recusa usuário que não existe', () => {
      expect(() => auth.login('joao@email.com', '123456')).toThrow('Usuário ou senha inválidos');
    });

    test('bloqueia a conta após 3 tentativas erradas', () => {
      for (let i = 0; i < 3; i++) {
        expect(() => auth.login('ana@email.com', 'errada')).toThrow();
      }

      // mesmo com a senha certa, a conta continua bloqueada
      expect(() => auth.login('ana@email.com', '123456')).toThrow('Conta bloqueada');
    });

    test('zera as tentativas depois de um login com sucesso', () => {
      expect(() => auth.login('ana@email.com', 'errada')).toThrow();
      expect(() => auth.login('ana@email.com', 'errada')).toThrow();
      auth.login('ana@email.com', '123456');

      // se não tivesse zerado, essa seria a 3ª falha e bloquearia
      expect(() => auth.login('ana@email.com', 'errada')).toThrow('Usuário ou senha inválidos');
      expect(auth.login('ana@email.com', '123456')).toEqual({ email: 'ana@email.com' });
    });
  });

  describe('logout', () => {
    test('desloga o usuário', () => {
      auth.cadastrar('ana@email.com', '123456');
      auth.login('ana@email.com', '123456');

      auth.logout();

      expect(auth.estaAutenticado()).toBe(false);
    });
  });
});
