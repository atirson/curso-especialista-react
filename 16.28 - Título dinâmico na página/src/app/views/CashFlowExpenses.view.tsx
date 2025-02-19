import {
  Button,
  Divider,
  notification,
  Row,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import {
  InfoCircleFilled,
  TagOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import EntriesList from '../features/EntriesList';
import useCashFlow from '../../core/hooks/useCashFlow';
import DoubleConfirm from '../components/DoubleConfirm';
import Modal from 'antd/lib/modal/Modal';
import { useState } from 'react';
import { useCallback } from 'react';
import EntryCategoryManager from '../features/EntryCategoryManager';
import EntryForm from '../features/EntryForm';
import EntryDetails from '../features/EntryDetails';
import moment from 'moment';
const { Title, Text } = Typography;

export default function CashFlowExpensesView() {
  const { selected, removeEntries, query } = useCashFlow('EXPENSE');

  const [editingEntry, setEditingEntry] = useState<number | undefined>(
    undefined
  );

  const [detailedEntry, setDetailedEntry] = useState<number | undefined>(
    undefined
  );

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const openCategoryModal = useCallback(() => setShowCategoryModal(true), []);
  const closeCategoryModal = useCallback(() => setShowCategoryModal(false), []);

  const openFormModal = useCallback(() => setShowFormModal(true), []);
  const closeFormModal = useCallback(() => setShowFormModal(false), []);

  const openDetailsModal = useCallback(() => setShowDetailsModal(true), []);
  const closeDetailsModal = useCallback(() => setShowDetailsModal(false), []);

  return (
    <>
      <Modal
        closeIcon={null}
        visible={showCategoryModal}
        onCancel={closeCategoryModal}
        footer={null}
        title={'Gerenciar categorias'}
        destroyOnClose
      >
        <EntryCategoryManager type={'EXPENSE'} />
      </Modal>
      <Modal
        closeIcon={null}
        visible={showFormModal}
        onCancel={() => {
          closeFormModal();
          setEditingEntry(undefined);
        }}
        footer={null}
        title={'Cadastrar despesa'}
        destroyOnClose
      >
        <EntryForm
          type={'EXPENSE'}
          editingEntry={editingEntry}
          onSuccess={() => {
            closeFormModal();
            notification.success({
              message: 'Entrada cadastrada com sucesso',
            });
          }}
        />
      </Modal>
      <Modal
        closeIcon={null}
        visible={showDetailsModal}
        onCancel={() => {
          closeDetailsModal();
        }}
        footer={null}
        title={'Detalhes da despesa'}
        destroyOnClose
      >
        {detailedEntry && <EntryDetails entryId={detailedEntry} />}
      </Modal>
      <Row justify={'space-between'} style={{ marginBottom: 16 }}>
        <DoubleConfirm
          popConfirmTitle={`Remover ${
            selected.length > 1
              ? 'entradas selecionadas?'
              : 'entrada selecionada?'
          }`}
          modalTitle={'Remover entradas'}
          modalContent={
            'Remover uma ou mais entradas pode gerar impacto negativo no gráfico de receitas e despesas da empresa. Esta é uma ação irreversível.'
          }
          onConfirm={async () => {
            await removeEntries(selected as number[]);
          }}
        >
          <Button type={'primary'} disabled={!selected.length}>
            Remover
          </Button>
        </DoubleConfirm>
        <Space>
          <Button
            type={'primary'}
            icon={<TagOutlined />}
            onClick={openCategoryModal}
          >
            Categorias
          </Button>
          <Button
            type={'primary'}
            icon={<PlusCircleOutlined />}
            onClick={openFormModal}
          >
            Adicionar despesa
          </Button>
        </Space>
      </Row>
      <Space direction={'vertical'}>
        <Title level={3}>
          Recuperando entradas do mês de{' '}
          {moment(query.yearMonth).format('MMMM \\d\\e YYYY')}
        </Title>
        <Space>
          <Text>É possível filtrar lançamentos por mês</Text>
          <Tooltip placement={'right'} title={'Use a coluna Data para filtrar'}>
            <InfoCircleFilled />
          </Tooltip>
        </Space>
      </Space>

      <Divider />

      <EntriesList
        onEdit={(id) => {
          setEditingEntry(id);
          openFormModal();
        }}
        onDetail={(id) => {
          setDetailedEntry(id);
          openDetailsModal();
        }}
      />
    </>
  );
}
