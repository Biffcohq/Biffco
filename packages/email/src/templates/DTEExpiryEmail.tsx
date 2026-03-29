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

export interface DTEExpiryEmailProps {
  documentId: string;
  documentType: string;
  expiryDate: string;
  url: string;
}

export function DTEExpiryEmail({
  documentId = "DTE-12345",
  documentType = "Documento de Tránsito Electrónico",
  expiryDate = new Date().toLocaleDateString(),
  url = "https://biffco.co",
}: DTEExpiryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Aviso de Expiración Próxima: {documentType}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans text-gray-900">
          <Container className="mx-auto my-[40px] max-w-[600px] border border-orange-200 bg-white rounded-lg p-[20px]">
            <Heading className="text-[24px] font-bold text-orange-600 p-0 mb-[20px]">
              Certificado Próximo a Expirar
            </Heading>
            <Text className="text-[14px] leading-[24px]">
              Te informamos que uno de los documentos criptográficos o autorizaciones de tránsito (DTE) bajo tu custodia está próximo a su fecha límite de validez.
            </Text>
            
            <Section className="bg-orange-50 border border-orange-100 rounded-md p-4 my-6">
              <Text className="text-[14px] m-0 mb-2"><strong>ID Documento:</strong> {documentId}</Text>
              <Text className="text-[14px] m-0 mb-2"><strong>Tipo:</strong> {documentType}</Text>
              <Text className="text-[14px] m-0 text-orange-800"><strong>Fecha de Expiración:</strong> {expiryDate}</Text>
            </Section>

            <Text className="text-[14px] leading-[24px]">
              Por favor, asegúrate de completar el movimiento físico de los activos o adjuntar un nuevo documento válido en la cadena de bloques para evitar que los activos asociados entren en estado de cuarentena automatizada.
            </Text>
            
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-orange-600 text-white px-5 py-3 rounded-md font-semibold text-[14px] no-underline inline-block"
                href={url}
              >
                Ver Documento
              </Button>
            </Section>
            <Hr className="border-gray-200" />
            <Text className="text-[12px] leading-[24px] text-gray-500 mt-[20px]">
              Notificación automática del oráculo regulatorio de BIFFCO.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default DTEExpiryEmail;
