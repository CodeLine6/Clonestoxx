import { getTradeAccountInfo } from '@/actions/tradeAccounts';
import { Breadcrumbs } from '@/components/breadcrumbs'
import TradeAccountForm from '@/components/forms/trade-account-form';
import PageContainer from '@/components/layout/PageContainer'
import { redirect } from 'next/navigation';

async function page({ params }) {
    const { accountId } = params;
    const breadcrumbItems = [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Trade Accounts', link: '/dashboard/trade-accounts' },
        { title: accountId !== "new" ? "Edit Trade Account" : "Add New Trade Account", link: `/dashboard/trade-accounts/${accountId}` }
    ];
    let initialData;

    if (accountId === "new") {
        initialData = null
    }
    else {
        const fetchTradeAccountInfo = await getTradeAccountInfo(accountId)

        if (!fetchTradeAccountInfo.success) {
            if (fetchTradeAccountInfo.message === "404: Trade Account not found")
                redirect("/404")
            else {
                return <PageContainer>
                    <div className="space-y-4">
                        <Breadcrumbs items={breadcrumbItems} />
                        <h1>{fetchTradeAccountInfo.message}</h1>
                    </div>
                </PageContainer>
            }
        }
        else {
            initialData = fetchTradeAccountInfo.tradeAccount
        }
    }

    return (
        <PageContainer>
            <div className="space-y-4">
                <Breadcrumbs items={breadcrumbItems} />
                <TradeAccountForm accountData={initialData} />
            </div>
        </PageContainer>
    )
}

export default page