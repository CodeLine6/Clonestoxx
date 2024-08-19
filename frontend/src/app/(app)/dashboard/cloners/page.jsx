import { getCloners } from '@/actions/cloners';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/PageContainer';
import { ClonersTable } from '@/components/tables/cloner-table/table';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Cloners', link: '/dashboard/cloners' }
];

async function page() {
    const fetchClonersRequest = await getCloners();

    if (!fetchClonersRequest.success) {
        return <PageContainer>
            <div className="space-y-4">
                <Breadcrumbs items={breadcrumbItems} />
                <h1>{fetchClonersRequest.message}</h1>
            </div>
        </PageContainer>
    }

    const clonersData = fetchClonersRequest.cloners
    return (
        <PageContainer>
            <div className="space-y-4">
                <Breadcrumbs items={breadcrumbItems} />
                <ClonersTable data={clonersData} />
            </div>
        </PageContainer>
    );
}

export default page