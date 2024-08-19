import { Breadcrumbs } from '@/components/breadcrumbs';
import ProdfileForm from '@/components/forms/profile-form';
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/app/api/auth/[...nextauth]/option';
import PageContainer from '@/components/layout/PageContainer';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Profile', link: '/dashboard/profile' }
];

const page = async () => {
    const session = await getServerSession(authOptions);
    return (
        <PageContainer>
            <div className="space-y-4">
                <Breadcrumbs items={breadcrumbItems} />
                <ProdfileForm sessionData={session} />
            </div>
        </PageContainer>
    );
}

export default page