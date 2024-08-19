import jwt from 'jsonwebtoken'
import ResetForm from './resetForm'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function page({ params }) {
    try {
        const payload = jwt.verify(params.token, process.env.NEXTAUTH_SECRET)
        return <ResetForm userId={payload.user.id} />
    } catch (error) {
        return <Card className="w-full max-w-md p-8 rounded-lg shadow-md">
            <CardHeader>
                <CardTitle>Invalid Token</CardTitle>
                <CardDescription>The token provided is invalid or expired</CardDescription>
            </CardHeader>
        </Card>
    }
}
export default page