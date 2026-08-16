// ================================================================
// CONFIGURAÇÕES EXTERNAS — edite este arquivo para ativar os serviços
// ================================================================

window.SMILE_CONFIG = {

  // --- Brevo (email marketing) ---
  // 1. Acesse brevo.com → crie conta gratuita
  // 2. Configurações → API Keys → Gerar nova chave
  // 3. Contatos → Listas → crie "Newsletter Smile" e "Avise-me Estoque"
  // 4. Cole o ID das listas e a API Key abaixo
  BREVO_API_KEY: '',
  BREVO_LIST_NEWSLETTER: 3,   // ID da lista Newsletter no Brevo
  BREVO_LIST_AVISE:      4,   // ID da lista "Avise-me Estoque" no Brevo

  // --- Firebase (login com Google) ---
  // 1. Acesse console.firebase.google.com → Novo projeto
  // 2. Adicionar app web → copie as credenciais abaixo
  // 3. Authentication → Método de login → Google → Ativar
  FIREBASE: {
    apiKey:            '',
    authDomain:        '',
    projectId:         '',
    storageBucket:     '',
    messagingSenderId: '',
    appId:             ''
  }
};
