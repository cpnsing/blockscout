import { Table, Tbody, Tr, Th } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import capitalize from 'lodash/capitalize';
import React, { useEffect, useState } from 'react';

import type { Block } from 'types/api/block';
import { default as Thead } from 'ui/shared/TheadSticky';
import ValidatorTableItem from './ValidatorTableItem';




interface Props {
    data: Array<Block>;
    isLoading?: boolean;
    // top: number;
    // page: number;
}

const ValidatorTable = ({ data, isLoading }: Props) => {

    return (
        <Table variant="simple" minWidth="1040px" size="md" fontWeight={500}>
            <Thead top={top}>
                <Tr>
                    <Th width="125px">Active Validators</Th>
                    <Th width="120px">Staked Amount</Th>
                    <Th width="120px" >Current Balance</Th>
                    <Th width="120px"> Block Validates</Th>

                </Tr>
            </Thead>
            <Tbody>
                <AnimatePresence initial={false}>
                    {data?.map((item, index) => (
                        <ValidatorTableItem
                            key={index}
                            data={item}
                            isLoading={isLoading}

                        />
                    ))}
                </AnimatePresence>
            </Tbody>
        </Table>
    );
};

export default ValidatorTable;