/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input } from '@rocketseat/unform';
import { toast } from 'react-toastify';
import { MdAdd, MdSearch, MdChevronLeft, MdChevronRight } from 'react-icons/md';

import api from '~/services/api';
import history from '~/services/history';

import Container from '~/components/Container';
import Loading from '~/components/Loading';
import Empty from '~/components/Empty';
import TableContainer from '~/components/TableContainer';
import Item from './Item';

import { AddButton, Footer } from './styles';

export default function Deliveryman() {
  const [loading, setLoading] = useState(false);
  const [deliverymans, setDeliverymans] = useState([]);
  const [page, setPage] = useState(1);

  const handleSearchDeliveryman = useCallback(({ search }) => {
    async function searchDeliveryman() {
      try {
        const response = await api.get(`/deliveryman`, {
          params: { q: search },
        });

        setDeliverymans(response.data);
      } catch ({ response }) {
        toast.error(response.error);
      }
    }
    searchDeliveryman();
  }, []);

  useEffect(() => {
    setLoading(true);

    async function loadDeliverymans() {
      try {
        const response = await api.get('/deliveryman', {
          params: { page },
        });

        setDeliverymans(response.data);
      } catch ({ response }) {
        toast.error(response.error);
      }
    }

    loadDeliverymans();

    setLoading(false);
  }, [page]);

  function handlePrevPage() {
    if (page === 1) return;
    setPage(page - 1);
  }

  function handleNextPage() {
    if (deliverymans.length < 5) return;
    setPage(page + 1);
  }

  return (
    <Container>
      <h2>Gerenciando entregadores</h2>

      <div>
        <Form onSubmit={handleSearchDeliveryman}>
          <div>
            <MdSearch size={24} color="#999" />

            <Input
              name="search"
              type="search"
              placeholder="Buscar por entregadores"
            />
          </div>
        </Form>

        <AddButton
          onClick={() => history.push('deliverymans/new')}
          type="button"
        >
          <MdAdd size={22} color="#fff" />
          Cadastrar
        </AddButton>
      </div>

      {loading ? (
        <Loading />
      ) : !deliverymans.length ? (
        <Empty name="entregadores" />
      ) : (
        <>
          <TableContainer>
            <thead>
              <tr>
                <th>ID</th>
                <th>Foto</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>

            {deliverymans.map(deliveryman => (
              <Item deliveryman={deliveryman} />
            ))}
          </TableContainer>

          <Footer>
            <header>
              <button
                type="button"
                onClick={() => {
                  handlePrevPage();
                }}
              >
                <MdChevronLeft size={36} color="#7d40e7" />
              </button>
              <button
                type="button"
                onClick={() => {
                  handleNextPage();
                }}
              >
                <MdChevronRight size={36} color="#7d40e7" />
              </button>
            </header>
          </Footer>
        </>
      )}
    </Container>
  );
}
