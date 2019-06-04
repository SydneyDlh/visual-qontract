import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'patternfly-react';
import GrafanaUrl from './GrafanaUrl';
import { sortByName } from '../../components/Utils';

function Namespaces({ namespaces }) {
  if (namespaces.length === 0) {
    return <p style={{ 'font-style': 'italic' }}>No namespaces.</p>;
  }

  const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
  const cellFormat = value => <Table.Cell>{value}</Table.Cell>;

  const processedNamespaces = sortByName(namespaces.slice()).map(ns => {
    ns.name_path = [ns.name, ns.path];
    if (typeof ns.cluster !== 'undefined') {
      ns.cluster_name_path = [ns.cluster.name, ns.cluster.path];
      console.log(ns);
      if (ns.grafanaUrl !== null) {
        ns.grafana_url = (
          <a href={ns.grafanaUrl} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        );
      } else {
        ns.grafana_url = <GrafanaUrl jumpHost={ns.cluster.jumpHost} cluster={ns.cluster.name} namespace={ns.name} />;
      }
    }

    return ns;
  });

  const colName = {
    header: {
      label: 'Name',
      formatters: [headerFormat]
    },
    cell: {
      formatters: [
        value => (
          <Link
            to={{
              pathname: '/namespaces',
              hash: value[1]
            }}
          >
            {value[0]}
          </Link>
        ),
        cellFormat
      ]
    },
    property: 'name_path'
  };

  const colPath = {
    header: {
      label: 'Path',
      formatters: [headerFormat]
    },
    cell: {
      formatters: [
        value => (
          <Link
            to={{
              pathname: '/namespaces',
              hash: value[1]
            }}
          >
            {value[1]}
          </Link>
        ),
        cellFormat
      ]
    },
    property: 'name_path'
  };

  const colCluster = {
    header: {
      label: 'Cluster',
      formatters: [headerFormat]
    },
    cell: {
      formatters: [
        value => (
          <Link
            to={{
              pathname: '/clusters',
              hash: value[1]
            }}
          >
            {value[0]}
          </Link>
        ),
        cellFormat
      ]
    },
    property: 'cluster_name_path'
  };

  const colGrafana = {
    header: {
      label: 'Grafana',
      formatters: [headerFormat]
    },
    cell: {
      formatters: [cellFormat]
    },
    property: 'grafana_url'
  };

  const colDescription = {
    header: {
      label: 'Description',
      formatters: [headerFormat]
    },
    cell: {
      formatters: [cellFormat]
    },
    property: 'description'
  };

  const tableCols =
    typeof namespaces[0].cluster.path === 'undefined'
      ? [colName, colPath, colGrafana, colDescription]
      : [colName, colPath, colCluster, colGrafana, colDescription];

  return (
    <Table.PfProvider striped bordered columns={tableCols}>
      <Table.Header />
      <Table.Body rows={processedNamespaces} rowKey="path" />
    </Table.PfProvider>
  );
}

export default Namespaces;
