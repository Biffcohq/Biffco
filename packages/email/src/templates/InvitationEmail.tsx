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
  Tailwind
} from '@react-email/components';

export interface InvitationEmailProps {
  workspaceName: string;
  inviterName: string;
  inviteeName?: string;
  verticalLabel?: string;
  acceptUrl: string;
  expiresIn?: string;
}

export function InvitationEmail({
  workspaceName = "Biffco Team",
  inviterName = "Alguien",
  verticalLabel = "Ganadería",
  acceptUrl = "https://biffco.co",
}: InvitationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Has sido invitado a unirte a {workspaceName} en BIFFCO</Preview>
      <Tailwind>
        <Body className="bg-white font-sans text-gray-900">
          <Container className="mx-auto my-[40px] max-w-[600px] border border-gray-200 rounded-lg p-[20px]">
            <Heading className="text-[24px] font-bold text-center p-0 my-[30px]">
              Invitación a {workspaceName}
            </Heading>
            <Text className="text-[14px] leading-[24px]">
              Hola,
            </Text>
            <Text className="text-[14px] leading-[24px]">
              <strong>{inviterName}</strong> te ha invitado a unirte a <strong>{workspaceName}</strong> en la red Biffco, sector <strong>{verticalLabel}</strong>.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-black text-white px-5 py-3 rounded-md font-semibold text-[14px] no-underline inline-block"
                href={acceptUrl}
              >
                Aceptar Invitación
              </Button>
            </Section>
            <Text className="text-[12px] leading-[24px] text-gray-500">
              O copia y pega esta URL en tu navegador: <br />
              <a href={acceptUrl} className="text-blue-600 no-underline">{acceptUrl}</a>
            </Text>
            <Text className="text-[12px] leading-[24px] text-gray-500 mt-[20px]">
              Atención: Este enlace expirará en 72 horas por seguridad.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

