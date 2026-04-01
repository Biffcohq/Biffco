import React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Img,
} from '@react-email/components';

interface TransferOfferEmailProps {
  senderWorkspaceName: string;
  targetWorkspaceName: string;
  assetCount: number;
  offerId: string;
  expiresAt: string;
}

export const TransferOfferEmail: React.FC<TransferOfferEmailProps> = ({
  senderWorkspaceName = "Estancia Los Álamos",
  targetWorkspaceName = "Feedlot Santa Rosa",
  assetCount = 40,
  offerId = "trk_827s9k2h",
  expiresAt = "24 horas",
}) => {
  return (
    <Html>
      <Head />
      <Preview>Nueva oferta de transferencia B2B de {senderWorkspaceName}</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif' }}>
        <Container style={{ backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', marginBottom: '64px' }}>
          <Section style={{ padding: '0 48px' }}>
            <Img
              src="https://biffco.co/logo-dark.png"
              width="150"
              height="auto"
              alt="Biffco Trust Infrastructure"
              style={{ marginTop: '24px', marginBottom: '24px' }}
            />
            <Text style={{ fontSize: '24px', lineHeight: '1.25', fontWeight: 700, color: '#101828' }}>
              Nueva Transferencia de Custodia
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#475467' }}>
              Hola equipo de <strong>{targetWorkspaceName}</strong>,
            </Text>
            <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#475467' }}>
              <strong>{senderWorkspaceName}</strong> ha iniciado una transferencia oficial de propiedad y custodia que requiere su revisión y firma criptográfica.
            </Text>
            
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '24px', marginTop: '24px', marginBottom: '24px' }}>
              <Text style={{ margin: 0, fontWeight: 600, color: '#101828' }}>Detalles del Lote</Text>
              <Text style={{ margin: '8px 0', color: '#475467' }}>Activos (Assets): <strong>{assetCount} unidades</strong></Text>
              <Text style={{ margin: '8px 0', color: '#475467' }}>Tracking ID: <strong>{offerId}</strong></Text>
              <Text style={{ margin: '8px 0', color: '#ef4444' }}>Vencimiento: <strong>{expiresAt}</strong></Text>
            </div>

            <Button
              href={`https://platform.biffco.co/${offerId}/transfers`}
              style={{ backgroundColor: '#0f172a', borderRadius: '6px', color: '#fff', fontSize: '16px', textDecoration: 'none', textAlign: 'center', display: 'block', padding: '14px 20px', fontWeight: 600 }}
            >
              Revisar y Aceptar (Approve)
            </Button>
            
            <Text style={{ fontSize: '14px', color: '#98a2b3', marginTop: '32px' }}>
              Esta transacción está regida bajo the Edge Blockchain Consensus rules. Si usted ignora esta petición, la oferta caducará y se reversará automáticamente en la fecha indicada.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default TransferOfferEmail;
