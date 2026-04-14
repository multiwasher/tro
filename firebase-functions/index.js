/**
 * Cloud Function - Notificação de Novo Registo
 * 
 * Quando um novo registo é criado no Firestore,
 * envia um email automático para qualidade@somengil.com
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure seu email e senha de app (Google)
// Vide: https://support.google.com/accounts/answer/185833
const EMAIL_USER = "qualidade@somengil.com";
const EMAIL_PASSWORD = "jiac vutj avro gkne";

// Criar transporter de email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

// Cloud Function - Disparada quando novo registo é criado
exports.notificarNovoRegisto = functions.firestore
  .document("registos/{docId}")
  .onCreate(async (snap, context) => {
    try {
      const registo = snap.data();
      const docId = context.params.docId;

      console.log("[Email] Novo registo criado:", registo.recordId);

      // Preparar conteúdo do email
      const emailContent = `
        <html lang="pt">
          <head>
            <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f7ff; border-radius: 8px; }
              .header { background: linear-gradient(135deg, #2d5be3, #4a7aff); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .content { background: white; padding: 20px; border-radius: 0 0 8px 8px; }
              .info-box { background: #f0f2f8; padding: 15px; border-left: 4px solid #2d5be3; margin: 15px 0; border-radius: 4px; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
              strong { color: #2d5be3; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Novo Registo Criado!</h1>
              </div>
              <div class="content">
                <p>Olá,</p>
                <p>Um novo registo foi criado no <strong>Trolley Check</strong>. Aqui estão os detalhes:</p>
                
                <div class="info-box">
                  <p><strong>ID do Registo:</strong> ${registo.recordId}</p>
                  <p><strong>Utilizador:</strong> ${registo.userName}</p>
                  <p><strong>Email:</strong> ${registo.userEmail}</p>
                  <p><strong>Data/Hora:</strong> ${registo.createdAt.toDate().toLocaleString("pt-PT")}</p>
                </div>
                
                <p>O registo foi salvo localmente e pode ser sincronizado com o Google Drive.</p>
                
                <p>Aceda ao app para consultar os detalhes completos.</p>
                
                <div class="footer">
                  <p>Este é um email automático da plataforma Trolley Check.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      // Enviar email
      const mailOptions = {
        from: EMAIL_USER,
        to: EMAIL_USER,
        subject: `✅ Novo Registo: ${registo.recordId}`,
        html: emailContent
      };

      await transporter.sendMail(mailOptions);
      console.log("[Email] Email enviado com sucesso para", EMAIL_USER);

      // Marcar como notificação enviada
      await snap.ref.update({
        notificationSent: true,
        notificationTime: admin.firestore.Timestamp.now()
      });

      return null;
    } catch (error) {
      console.error("[Email] Erro ao enviar email:", error);
      // Não lançar erro para não fazer retry infinito
      return null;
    }
  });
