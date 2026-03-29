import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr
} from '@react-email/components';

export interface HoldAlertEmailProps {
  assetId: string;
  assetType: string;
  reason: string;
  heldAt: string;
  url: string;
}

export function HoldAlertEmail({
  assetId = "LOTE-001",
  assetType = "Lote de Soja",
  reason = "Alerta satelital GFW de deforestación reciente detectada en la zona de origen.",
  heldAt = new Date().toLocaleDateString(),
  url = "https://biffco.co",
}: HoldAlertEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Alerta de Suspensión: {assetType} {assetId}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-900">
          <Container className="mx-auto my-[40px] max-w-[600px] border border-red-200 bg-white rounded-lg p-[20px]">
            <Heading className="text-[24px] font-bold text-red-600 p-0 mb-[20px]">
              Alerta de Bloqueo Automático
            </Heading>
            <Text className="text-[14px] leading-[24px]">
              El sistema inteligente ha colocado un HOLD preventivo sobre uno de los activos en custodia debido a un incumplimiento regulatorio potencial.
            </Text>
            
            <Section className="bg-red-50 border border-red-100 rounded-md p-4 my-6">
              <Text className="text-[14px] m-0 mb-2"><strong>ID del Activo:</strong> {assetId}</Text>
              <Text className="text-[14px] m-0 mb-2"><strong>Tipo:</strong> {assetType}</Text>
              <Text className="text-[14px] m-0 mb-2"><strong>Fecha de Bloqueo:</strong> {heldAt}</Text>
              <Text className="text-[14px] m-0 text-red-800"><strong>Motivo:</strong> {reason}</Text>
            </Section>

            <Text className="text-[14px] leading-[24px]">
              Atención: Este activo no puede ser transferido, exportado, ni transformado hasta que el HOLD sea levantado por un auditor o mediante la presentación de pruebas que refuten la alerta.
            </Text>
            
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-red-600 text-white px-5 py-3 rounded-md font-semibold text-[14px] no-underline inline-block"
                href={url}
              >
                Revisar Activo
              </Button>
            </Section>
            <Hr className="border-gray-200" />
            <Text className="text-[12px] leading-[24px] text-gray-500 mt-[20px]">
              Este es un correo automático normativo de BIFFCO (EUDR Compliance).
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default HoldAlertEmail;
