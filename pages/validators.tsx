import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import Page from 'ui/shared/Page/Page';
import { Button } from '@chakra-ui/react';

const Validators = dynamic(() => import('ui/pages/Validators'), { ssr: false });

const ValidatorsPage: NextPage = () => {
    const title = getNetworkTitle();
    return (
        <>
            <Head><title>{title}</title></Head>
            <Page>
                <Button
                    onClick={() => window.open("https://taraldocs.tarality.com/getting-started/developer-guide/nodes-and-validators/install-taral-chain")}

                    style={{ marginBottom: "10px" }} >Become a Validator</Button>
                <Validators />
            </Page>
        </>
    );
};

export default ValidatorsPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';
