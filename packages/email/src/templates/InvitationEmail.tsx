export interface InvitationEmailProps {
  workspaceName: string;
  inviterName: string;
  inviteeName?: string;
  verticalLabel: string;
  acceptUrl: string;
  expiresIn?: string;
}

export function InvitationEmail({
  workspaceName,
  inviterName,
  verticalLabel,
  acceptUrl
}: InvitationEmailProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Invitación a {workspaceName}</h1>
      <p>Hola,</p>
      <p>{inviterName} te ha invitado a unirte a <strong>{workspaceName}</strong> en la plataforma BIFFCO ({verticalLabel}).</p>
      <a href={acceptUrl} style={{ background: '#000', color: '#fff', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px' }}>
        Aceptar Invitación
      </a>
      <p style={{ marginTop: '20px', color: '#666', fontSize: '12px' }}>
        El enlace expirará en 72 horas.
      </p>
    </div>
  );
}
