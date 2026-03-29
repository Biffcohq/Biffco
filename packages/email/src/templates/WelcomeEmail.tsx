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

export interface WelcomeEmailProps {
  workspaceName?: string;
  memberName?: string;
  verticalLabel?: string;
  dashboardUrl?: string;
  firstSteps?: string[];
}

export function WelcomeEmail({
  workspaceName = "BIFFCO Team",
  memberName = "Usuario",
  verticalLabel = "Ganadería",
  dashboardUrl = "https://biffco.co",
  firstSteps = ["Configura tu cuenta"]
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bienvenido a la red de confianza de Biffco</Preview>
      <Tailwind>
        <Body className="bg-white font-sans text-gray-900">
          <Container className="mx-auto my-[40px] max-w-[600px] border border-gray-200 rounded-lg p-[20px]">
            <Heading className="text-[24px] font-bold text-center p-0 my-[30px]">
              ¡Bienvenido a {workspaceName}!
            </Heading>
            <Text className="text-[14px] leading-[24px]">
              Hola <strong>{memberName}</strong>,
            </Text>
            <Text className="text-[14px] leading-[24px]">
              Tu identidad criptográfica ha sido generada exitosamente, y tu cuenta ahora pertenece oficialmente a la red de trazabilidad y confianza Biffco, operando en el sector de <strong>{verticalLabel}</strong>.
            </Text>
            <Text className="text-[14px] leading-[24px]">
              Tus próximos pasos sugeridos:
            </Text>
            <ul className="text-[14px] leading-[24px]">
              {firstSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-black text-white px-5 py-3 rounded-md font-semibold text-[14px] no-underline inline-block"
                href={dashboardUrl}
              >
                Ir a mi Dashboard
              </Button>
            </Section>
            <Hr className="border-gray-200" />
            <Text className="text-[12px] leading-[24px] text-gray-500 mt-[20px]">
              Si tienes preguntas, contáctanos a soporte@biffco.co
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default WelcomeEmail;
