import { getClonerInfo } from '@/actions/cloners';
import { getTradeAccounts } from '@/actions/tradeAccounts';
import { Breadcrumbs } from '@/components/breadcrumbs';
import ClonerForm from '@/components/forms/cloner-form';
import PageContainer from '@/components/layout/PageContainer';
import { notFound } from 'next/navigation';

async function ClonerPage({ params }) {
    const { clonerId } = params;
    const isNewCloner = clonerId === "new";

    const breadcrumbItems = [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Cloners', link: '/dashboard/cloners' },
        { title: isNewCloner ? "Create New Cloner" : "Edit Cloner", link: `/dashboard/cloners/${clonerId}` }
    ];

    const [clonerInfo, tradeAccounts] = await Promise.all([
        isNewCloner ? null : getClonerInfo(clonerId),
        getTradeAccounts()
    ]);

    if (!isNewCloner && !clonerInfo.success) {
        if (clonerInfo.message === "Cloner not found") {
            notFound();
        }
        return <ErrorDisplay message={clonerInfo.message} breadcrumbItems={breadcrumbItems} />;
    }

    if (!tradeAccounts.success) {
        return <ErrorDisplay message="Failed to fetch trade accounts" breadcrumbItems={breadcrumbItems} />;
    }

    const initialData = isNewCloner ? null : clonerInfo.cloner;

    return (
        <PageContainer>
            <div className="space-y-4 pb-8">
                <Breadcrumbs items={breadcrumbItems} />
                <ClonerForm clonerData={initialData} tradeAccountsList={tradeAccounts.tradeAccounts} />
            </div>
        </PageContainer>
    );
}

function ErrorDisplay({ message, breadcrumbItems }) {
    return (
        <PageContainer>
            <div className="space-y-4">
                <Breadcrumbs items={breadcrumbItems} />
                <h1 className="text-red-600">{message}</h1>
            </div>
        </PageContainer>
    );
}

export default ClonerPage;