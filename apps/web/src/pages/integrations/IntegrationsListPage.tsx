import { Container } from '@mantine/core';
import { useCallback, useMemo } from 'react';

import PageContainer from '../../components/layout/components/PageContainer';
import PageHeader from '../../components/layout/components/PageHeader';
import { Table, Text, withCellLoading } from '../../design-system';
import { IExtendedColumn } from '../../design-system/table/Table';
import { useIntegrations, useIsMultiProviderConfigurationEnabled } from '../../hooks';
import { IntegrationsListToolbar } from './components/IntegrationsListToolbar';
import { useFetchEnvironments } from '../../hooks/useFetchEnvironments';
import { IntegrationNameCell } from './components/IntegrationNameCell';
import type { ITableIntegration } from './types';
import { IntegrationChannelCell } from './components/IntegrationChannelCell';
import { IntegrationEnvironmentCell } from './components/IntegrationEnvironmentCell';
import { IntegrationStatusCell } from './components/IntegrationStatusCell';
import { When } from '../../components/utils/When';
import { IntegrationsListNoData } from './components/IntegrationsListNoData';
import { mapToTableIntegration } from './utils';
import { IntegrationsStore } from './IntegrationsStorePage';

const columns: IExtendedColumn<ITableIntegration>[] = [
  {
    accessor: 'name',
    Header: 'Name',
    Cell: IntegrationNameCell,
  },
  {
    accessor: 'provider',
    Header: 'Provider',
    Cell: withCellLoading(
      ({ row: { original } }) => {
        return (
          <Text data-test-id="integration-provider-cell" rows={1}>
            {original.provider}
          </Text>
        );
      },
      { loadingTestId: 'integration-provider-cell-loading' }
    ),
  },
  {
    accessor: 'channel',
    Header: 'Channel',
    Cell: IntegrationChannelCell,
  },
  {
    accessor: 'environment',
    Header: 'Environment',
    Cell: IntegrationEnvironmentCell,
  },
  {
    accessor: 'active',
    Header: 'Status',
    width: 125,
    maxWidth: 125,
    Cell: IntegrationStatusCell,
  },
];

const IntegrationsList = () => {
  const { environments, isLoading: areEnvironmentsLoading } = useFetchEnvironments();
  const { integrations, loading: areIntegrationsLoading } = useIntegrations();
  const isLoading = areEnvironmentsLoading || areIntegrationsLoading;
  const hasIntegrations = integrations && integrations?.length > 0;
  const data = useMemo<ITableIntegration[] | undefined>(
    () => integrations?.map((el) => mapToTableIntegration(el, environments)),
    [integrations, environments]
  );

  const onRowClickCallback = useCallback((item) => {
    // eslint-disable-next-line no-console
    console.log('onRowClickCallback', item);
  }, []);

  const onChannelClickCallback = useCallback((item) => {
    // eslint-disable-next-line no-console
    console.log('onChannelClickCallback', item);
  }, []);

  return (
    <PageContainer title="Integrations">
      <PageHeader title="Integrations Store" />
      <Container fluid sx={{ padding: '0 30px 8px 30px' }}>
        <IntegrationsListToolbar areIntegrationsLoading={isLoading} />
      </Container>
      <When truthy={hasIntegrations || isLoading}>
        <Table
          onRowClick={onRowClickCallback}
          loading={isLoading}
          data-test-id="integrations-list-table"
          columns={columns}
          data={data}
        />
      </When>
      <When truthy={!hasIntegrations && !isLoading}>
        <IntegrationsListNoData onChannelClick={onChannelClickCallback} />
      </When>
    </PageContainer>
  );
};

export const IntegrationsListPage = () => {
  const isIntegrationsListPageEnabled = useIsMultiProviderConfigurationEnabled();

  return isIntegrationsListPageEnabled ? <IntegrationsList /> : <IntegrationsStore />;
};