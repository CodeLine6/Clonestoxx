import { getTradeAccounts } from '@/actions/tradeAccounts';
import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/PageContainer';
import { TradeAccountsTable } from '@/components/tables/trade-account-table/table';

const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Trade Accounts', link: '/dashboard/trade-accounts' }
];

async function page() {
    const fetchTradeAccountRequest = await getTradeAccounts();

    if (!fetchTradeAccountRequest.success) {
        return <PageContainer>
            <div className="space-y-4">
                <Breadcrumbs items={breadcrumbItems} />
                <h1>{fetchTradeAccountRequest.message}</h1>
            </div>
        </PageContainer>
    }

    const accountsData = fetchTradeAccountRequest.tradeAccounts
    return (
        <PageContainer>
            <div className="space-y-4">
                <Breadcrumbs items={breadcrumbItems} />
                <TradeAccountsTable data={accountsData} />
            </div>
        </PageContainer>
    );
}

export default page