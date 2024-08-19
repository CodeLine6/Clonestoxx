import { Html, Head, Font, Preview, Heading, Row, Section, Text, Button } from '@react-email/components';

export default function ResetPasswordLink({ username, resetPasswordToken }) {
    return <Html lang="en" dir="ltr">
        <Head>
            <title>Reset Password</title>
            <Font
                fontFamily="Roboto"
                fallbackFontFamily="Verdana"
                webFont={{
                    url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                    format: 'woff2',
                }}
                fontWeight={400}
                fontStyle="normal"
            />
        </Head>
        <Preview>Password Reset Request for {username}</Preview>
        <Section>
            <Row>
                <Heading as="h2">Hello {username},</Heading>
            </Row>
            <Row>
                <Text>
                    Someone (hopefully you) has requested a password reset for your
                    account. If this was you, click the button below to reset your
                    password:
                </Text>
            </Row>
            <Row>
                <Button
                    href={`http://localhost:3000/reset-password/${resetPasswordToken}`}
                    style={{ color: '#0016ff' }}
                >
                    Reset Password
                </Button>
                <Text>
                    Note : The link is only valid for 24 hours.
                </Text>
            </Row>
            <Row>
                <Text>
                    If you did not request a password reset, please ignore this email.
                </Text>
            </Row>
        </Section>
    </Html>
}