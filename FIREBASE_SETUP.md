# Guia Completo: Cloud Functions para Notificações por Email

## 📋 Pré-requisitos

1. **Node.js instalado** (versão 18+)
   - Download: https://nodejs.org/

2. **Firebase CLI instalado**
   ```bash
   npm install -g firebase-tools
   ```

3. **Gmail App Password** configurada
   - Aceda a: https://myaccount.google.com/apppasswords
   - Selecione: "Mail" e "Windows Computer" (ou seu dispositivo)
   - Gere a senha de app
   - Copie a senha de 16 caracteres

---

## 🚀 Passos para Fazer Deploy

### **Passo 1: Abra um Terminal no seu Computador**

```bash
# Navegue até à pasta do projeto
cd caminho/para/seu/projeto/tro
```

### **Passo 2: Inicialize Firebase (primeira vez apenas)**

```bash
firebase login
# Vai abrir o browser - faça login com sua conta Google
```

### **Passo 3: Atualize o Gmail App Password**

Abra o arquivo `firebase-functions/index.js` e procure por:

```javascript
const EMAIL_PASSWORD = "YOUR_GMAIL_APP_PASSWORD"; // Substituir!
```

Substitua `YOUR_GMAIL_APP_PASSWORD` pela senha de app que gerou no Gmail (16 caracteres).

**Exemplo:**
```javascript
const EMAIL_PASSWORD = "abcd efgh ijkl mnop"; // ← Senha real do Gmail
```

### **Passo 4: Instale as Dependências**

```bash
cd firebase-functions
npm install
cd ..
```

### **Passo 5: Faça Deploy da Cloud Function**

```bash
firebase deploy --only functions
```

⏳ Vai levar 1-2 minutos...

Quando terminar, verá:
```
✔ Deploy complete!

Function URL: https://us-central1-trolley-check.cloudfunctions.net/notificarNovoRegisto
```

### **Passo 6: Ative Firestore Triggers (se não estiverem ativas)**

No Firebase Console:
1. Vá para **Firestore Database**
2. Crie uma coleção chamada **`registos`** (vazia está bem)
3. Volte a fazer deploy:
   ```bash
   firebase deploy --only functions
   ```

---

## ✅ Testar se Está Funcionando

### **No seu app (mobile ou web):**

1. Abra a aplicação
2. Criar um novo registo
3. Clique em "Novo Registo"
4. Aguarde 5-10 segundos

### **Verificar Email**

- Verifique a caixa de entrada de `qualidade@somengil.com`
- Procure por um email com o assunto: `✅ Novo Registo: TRO-XXX`

### **Verificar Logs**

Se não receber o email, veja os logs:

```bash
firebase functions:log
```

Procure por erros tipo:
- `[Email] Email enviado com sucesso` ✅
- `[Email] Erro ao enviar email: ...` ❌

---

## 🔧 Troubleshooting

### **Erro: "Invalid login"**
- Verifique se a Gmail App Password está correta (espaços inclusos)
- Verifique se o 2-Step Verification está ativado no Gmail

### **Erro: "Firebase project not found"**
- Faça login novamente: `firebase login`
- Verifique se está na pasta correta: `ls firebase-functions/`

### **Nenhum email foi enviado**
- Verifique os logs: `firebase functions:log`
- Verifique se Firestore está respondendo
- Aceda ao Firebase Console > Cloud Functions > notificarNovoRegisto

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs: `firebase functions:log`
2. Veja a mensagem de erro exata
3. Copie a mensagem e procure em: https://stackoverflow.com

---

## 🎯 Próximos Passos (Opcional)

- Adicione mais emails para CC
- Customize o template do email
- Adicione mais eventos (atualizações, conclusões, etc)

